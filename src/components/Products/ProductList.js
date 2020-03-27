import React, { useState, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { PRODUCTS_QUERY } from "../Providers/Queries";
import ProductPage from "./ProductPage";
import ProductCard from "./ProductCard";
import ProductSort from "./ProductSort";
import Constructor from "../Constructor/Constructor";

import { useSpring, animated } from "react-spring";

import useGetAndSort from "../Hooks/useGetAndSort";
// import prodlistsvg from "../../img/productlisttop.svg";
import "./ProductList.css";

const ProductList = ({ ScreenWidth }) => {
  const [size, setSize] = useState();

  const _constructorref = useRef(null);
  const constructorScroll = () =>
    ScreenWidth < 1320 &&
    window.scrollTo(0, _constructorref.current.offsetTop * 2);

  const stylePropsLeft = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width:
      ScreenWidth > 1320
        ? size
          ? `50%`
          : ScreenWidth > 1700
          ? `85%`
          : `80%`
        : `100%`
  });

  const stylePropsRight = useSpring({
    config: { mass: 1, tension: 280, friction: 60 },
    width:
      ScreenWidth > 1320
        ? size
          ? `50%`
          : ScreenWidth > 1700
          ? `15%`
          : `20%`
        : `100%`
  });

  return (
    <main className="ProductList-container">
      {/* <img className="ProductList-topsvg" src={prodlistsvg} alt="" />
      <img className="ProductList-topsvg right" src={prodlistsvg} alt="" /> */}
      <div className="ProductList-wrapper">
        <animated.div style={stylePropsLeft}>
          <div className="ProductList-bundles">
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Bundles
                    {...props}
                    ScreenWidth={size ? ScreenWidth / 2 : (ScreenWidth * 3) / 4}
                  />
                )}
              />
              <Route
                exact
                path="/:id/:title"
                render={props => (
                  <ProductPage {...props} scroll={constructorScroll} />
                )}
              />
            </Switch>
          </div>
        </animated.div>
        <animated.div ref={_constructorref} style={stylePropsRight}>
          <Constructor size={size} setSize={setSize} />
        </animated.div>
      </div>
    </main>
  );
};

const Bundles = ({ ScreenWidth }) => {
  const [sortstate, setSortstate] = useState({
    tags: [],
    offset: 0,
    page: 0
  });

  const {
    output: { filtered, sortProps },
    dispatch
  } = useGetAndSort(PRODUCTS_QUERY);

  const productsPerPage = ScreenWidth <= 1000 ? 16 : 8;

  // const _tags = [
  //   ...new Set(
  //     filtered.reduce((acc, i) => [...acc, ...i.tags.map(tag => tag.name)], [])
  //   )
  // ];

  return (
    <>
      <ProductSort sortProps={sortProps} dispatch={dispatch} />
      <div className="ProductList-bundles-list">
        {filtered.map(
          (product, index) =>
            index >= sortstate.offset &&
            index < sortstate.offset + productsPerPage && (
              <ProductCard
                key={product.id}
                product={product}
                ScreenWidth={ScreenWidth}
              />
            )
        )}
      </div>
      <Pagination
        length={filtered.length}
        limit={productsPerPage}
        sortstate={sortstate}
        setSortstate={setSortstate}
      />
    </>
  );
};

const Pagination = ({ length, limit, sortstate, setSortstate }) => {
  const _pageQuantity = Math.ceil(length / limit);

  if (length < 1) return null;

  return (
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
                Math.ceil(sortstate.offset / limit) === index ? "active" : ""
              }
              key={index}
              onClick={() =>
                setSortstate({
                  ...sortstate,
                  offset: limit * index
                })
              }
            >
              {index + 1}
            </div>
          )
      )}
      {length && _pageQuantity > 10 && _pageQuantity - sortstate.page > 10 && (
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
                offset: limit * (_pageQuantity - 1),
                page: _pageQuantity - 10
              })
            }
          >
            {_pageQuantity}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
