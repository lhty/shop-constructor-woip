import React, { useMemo } from "react";
import { Route } from "react-router-dom";

import { useQuery } from "react-apollo-hooks";
import { PRODUCTS_QUERY } from "../../store/Queries";

import Featured from "../Featured";
import ProductPage from "./ProductPage";
import ProductCard from "./Shared/ProductCard";
import ProductSort from "./Shared/ProductSort";
import Pages from "./Shared/Pages";
import Constructor from "./Constructor";

import { useSort } from "../../hooks/useSort";
import { usePagination } from "../../hooks/usePagination";

import SlideFade from "../Effects/SlideFade";
import "./index.css";

const Container = () => {
  const { data } = useQuery(PRODUCTS_QUERY);

  const {
    output: { filtered, initial, sortProps },
    dispatch,
  } = useSort(data?.products);

  const featuredProducts = useMemo(
    () => <Featured {...{ products: data?.products }} />,
    [data]
  );

  return (
    <>
      {featuredProducts}
      <section className="ProductList-container w85">
        <div className="ProductList-wrapper">
          <div className="ProductList-bundles">
            <Route exact path="/">
              <SlideFade condition={true} dist={100}>
                <BundlesContainer
                  {...{
                    products: initial,
                    filtered,
                    sortProps,
                    dispatch,
                  }}
                />
              </SlideFade>
            </Route>
            <Route exact path="/:id/:title">
              <ProductPage />
            </Route>
          </div>
          <Constructor />
        </div>
      </section>
    </>
  );
};

const BundlesContainer = ({
  products,
  filtered,
  limit = 20,
  sortProps,
  dispatch,
}) => {
  const { currentPage, controls } = usePagination(filtered, limit);

  return (
    <>
      <ProductSort
        {...{
          sortProps,
          dispatch,
          options: [["Ключевые слова", "tags"], "price", "size"],
          products,
          filtered,
        }}
      />
      <div className="Item-list">
        {currentPage.map((product, index) => (
          <ProductCard {...{ key: index, product }} />
        ))}
      </div>
      <Pages {...controls} />
    </>
  );
};

export default Container;
