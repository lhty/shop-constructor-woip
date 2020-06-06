import React from "react";
import { Route, Switch } from "react-router-dom";

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

import "./index.css";

const Container = () => {
  const { data } = useQuery(PRODUCTS_QUERY);

  const {
    output: { filtered, sortProps },
    dispatch,
  } = useSort(data?.products);

  return (
    <>
      <Featured {...{ products: filtered }} />
      <section className="ProductList-container w90 center">
        <div className="ProductList-wrapper">
          <div className="ProductList-bundles">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <BundlesContainer
                    {...{
                      products: filtered,
                      tags: data?.tags,
                      sortProps,
                      dispatch,
                    }}
                  />
                )}
              />
              <Route exact path="/:id/:title" render={() => <ProductPage />} />
            </Switch>
          </div>
          <Constructor />
        </div>
      </section>
    </>
  );
};

const BundlesContainer = ({
  products,
  tags,
  limit = 20,
  sortProps,
  dispatch,
}) => {
  const { currentPage, controls } = usePagination(products, limit);

  return (
    <>
      <ProductSort
        {...{
          sortProps,
          dispatch,
          controls,
          options: [["Ключевые слова", "tags", tags], "price", "size"],
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
