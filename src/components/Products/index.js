import React from "react";
import { Route, Switch } from "react-router-dom";
import { PRODUCTS_QUERY } from "../../containers/Queries";

import Featured from "../Featured";
import ProductPage from "./ProductPage";
import ProductCard from "./Shared/ProductCard";
import ProductSort from "./Shared/ProductSort";
import Pages from "./Shared/Pages";
import Constructor from "./Constructor";

import useProducts from "../../hooks/useProducts";
import { usePagination } from "../../hooks/usePagination";

import "./index.css";

const Container = () => {
  const {
    output: { filtered, sortProps },
    dispatch,
  } = useProducts(PRODUCTS_QUERY);

  return (
    <>
      <Featured {...{ products: filtered }} />
      <section className="ProductList-container">
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
      </section>
    </>
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
