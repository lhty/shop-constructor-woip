import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
  useCallback
} from "react";
import { Route, Switch } from "react-router-dom";
import { useQuery } from "react-apollo-hooks";
import { PRODUCTS_QUERY } from "../Providers/Queries";
import Spinner from "../Assets/Spinner";
import ProductPage from "./ProductPage";
import ProductCard from "./ProductCard";
import Constructor from "../Constructor/Constructor";
import { Context } from "../Providers/Provider";

import sortprice from "../../img/sort-byprice.svg";
import sortsize from "../../img/sort-bypsize.svg";
import prodlistsvg from "../../img/productlisttop.svg";
import "./ProductList.css";

const ProductList = () => {
  const [size, setSize] = useState();
  const styles = {
    left: {
      width: size ? "50%" : "85%"
    },
    right: {
      width: size ? "50%" : "15%"
    }
  };

  return (
    <section className="ProductList-container">
      <img className="ProductList-topsvg" src={prodlistsvg} alt="" />
      <img className="ProductList-topsvg right" src={prodlistsvg} alt="" />
      <div className="ProductList-wrapper">
        <div style={styles.left}>
          <div className="ProductList-bundles">
            <Switch>
              <Route exact path="/" component={Bundles} />
              <Route exact path="/:id/:title" component={ProductPage} />
            </Switch>
          </div>
        </div>
        <div style={styles.right}>
          <Constructor size={size} setSize={setSize} />
        </div>
      </div>
    </section>
  );
};

const Bundles = () => {
  const { sortstate, setSortstate, MakeBundle } = useContext(Context);

  function sortReducer(state, action) {
    switch (action.type) {
      case "BY_PRICE":
        return [
          ...action.payload.sort((a, b) =>
            sortstate.byprice ? a.price - b.price : b.price - a.price
          )
        ];
      case "BY_SIZE":
        return [
          ...action.payload.sort((a, b) =>
            sortstate.bysize
              ? b.proportion.countmin - a.proportion.countmin
              : a.proportion.countmin - b.proportion.countmin
          )
        ];
      case "UPDATE":
        return action.payload;
      default:
        return state;
    }
  }

  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  const initalState = useCallback(
    () =>
      data && data.products
        ? MakeBundle(data.products).filter(obj => obj.show)
        : [],
    [data, MakeBundle]
  );
  const [productsort, sortDispatch] = useReducer(sortReducer, initalState());

  useEffect(() => {
    !productsort.length &&
      data &&
      data.products &&
      sortDispatch({
        type: "UPDATE",
        payload: MakeBundle(data.products).filter(obj => obj.show)
      });
  }, [data, productsort, MakeBundle]);

  useEffect(() => {
    if (sortstate.byprice)
      sortDispatch({ type: "BY_PRICE", payload: productsort });

    if (sortstate.bysize)
      sortDispatch({ type: "BY_SIZE", payload: productsort });

    sortDispatch({
      type: "UPDATE",
      payload: productsort
    });
  }, [sortstate, productsort]);

  const _pageQuantity = Math.ceil(productsort.length / sortstate.limit);

  if (loading || error) return <Spinner />;

  return (
    <>
      <div className="ProductList-bundles-sort">
        <div
          className={
            sortstate.byprice
              ? "sort-by"
              : sortstate.byprice === null
              ? "sort-by inactive"
              : "sort-by"
          }
          onClick={() => {
            sortDispatch({ type: "BY_PRICE", payload: productsort });
            setSortstate({ ...sortstate, byprice: !sortstate.byprice });
          }}
        >
          по цене
          <img
            className={
              sortstate.byprice === null
                ? "hidden"
                : sortstate.byprice
                ? ""
                : "reversed"
            }
            src={sortprice}
            alt=""
          />
        </div>
        <div
          className={
            sortstate.bysize
              ? "sort-by"
              : sortstate.bysize === null
              ? "sort-by inactive"
              : "sort-by"
          }
          onClick={() => {
            sortDispatch({ type: "BY_SIZE", payload: productsort });
            setSortstate({ ...sortstate, bysize: !sortstate.bysize });
          }}
        >
          по размеру
          <img
            className={
              sortstate.bysize === null
                ? "hidden"
                : sortstate.bysize
                ? ""
                : "small"
            }
            src={sortsize}
            alt=""
          />
        </div>
      </div>
      {productsort.map(
        (product, index) =>
          index >= sortstate.offset &&
          index < sortstate.offset + sortstate.limit && (
            <ProductCard key={product.id} product={product} />
          )
      )}
      <div className="ProductList-bundles-pagination">
        {sortstate.page >= 10 && (
          <>
            <div
              className="lastpage"
              onClick={() =>
                setSortstate({
                  ...sortstate,
                  offset: 0,
                  page: 0
                })
              }
            >
              1
            </div>
            <div
              onClick={() =>
                setSortstate({ ...sortstate, page: sortstate.page - 10 })
              }
            >
              ...
            </div>
          </>
        )}
        {[...Array(_pageQuantity).keys()].map(
          (_, index, arr) =>
            index >= sortstate.page &&
            index < sortstate.page + 10 && (
              <div
                className={
                  Math.ceil(sortstate.offset / sortstate.limit) === index
                    ? "active"
                    : ""
                }
                key={index}
                onClick={() =>
                  setSortstate({
                    ...sortstate,
                    offset: sortstate.limit * index
                  })
                }
              >
                {index + 1}
              </div>
            )
        )}
        {productsort &&
          _pageQuantity > 10 &&
          _pageQuantity - sortstate.page > 10 && (
            <>
              <div
                onClick={() =>
                  setSortstate({ ...sortstate, page: sortstate.page + 10 })
                }
              >
                ...
              </div>
              <div
                className="lastpage"
                onClick={() =>
                  setSortstate({
                    ...sortstate,
                    offset: sortstate.limit * (_pageQuantity - 1),
                    page: _pageQuantity - 10
                  })
                }
              >
                {_pageQuantity}
              </div>
            </>
          )}
      </div>
    </>
  );
};

export default ProductList;
