import React from "react";
import { Route, Switch } from "react-router-dom";
import { PRODUCTS_QUERY } from "../Providers/Queries";
import Pages from "./Shared/Pages";
import ProductPage from "./ProductPage";
import ProductCard from "./Shared/ProductCard";
import ProductSort from "./Shared/ProductSort";
import Constructor from "./Constructor/Constructor";

import useProducts from "../Hooks/useProducts";
import { usePagination } from "../Hooks/usePagination";

import "./index.css";

const Container = () => {
  const {
    output: { filtered, sortProps },
    dispatch,
  } = useProducts(PRODUCTS_QUERY);

  return (
    <main className="ProductList-container">
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
    </main>
  );
};

const BundlesContainer = ({ products, limit = 20, sortProps, dispatch }) => {
  const { currentPage, controls } = usePagination(products, limit);
  return (
    <>
      <ProductSort {...{ sortProps, dispatch, controls }} />
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
