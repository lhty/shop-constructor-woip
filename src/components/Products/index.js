import React, { useState, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { PRODUCTS_QUERY } from "../Providers/Queries";
import Pages from "./Pages";
import ProductPage from "./ProductPage";
import ProductCard from "./ProductCard";
import ProductSort from "./ProductSort";
import Constructor from "./Constructor/Constructor";

import { useSpring, animated } from "react-spring";
import useResizeAware from "react-resize-aware";

import useProducts from "../Hooks/useProducts";
import { usePagination } from "../Hooks/usePagination";

import "./index.css";

const Container = () => {
  const [constructor, toggleOff] = useState();
  const _constructorref = useRef(null);

  const products_per_page = constructor ? 20 : 15;

  const constructorScroll = () =>
    window.innerWidth < 1320 &&
    window.scrollTo(0, _constructorref.current.offsetTop * 2);

  const {
    output: { filtered, sortProps },
    dispatch,
  } = useProducts(PRODUCTS_QUERY);

  const stylePropsLeft = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width: window.innerWidth > 1320 ? (constructor ? `50%` : `80%`) : `100%`,
  });

  const stylePropsRight = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width: window.innerWidth > 1320 ? (constructor ? `50%` : `20%`) : `100%`,
  });

  const [resizeListener, sizes] = useResizeAware();
  const smoothHeight = useSpring({
    from: { height: 0 },
    height: sizes.height,
  });

  return (
    <animated.main style={smoothHeight} className="ProductList-container">
      <div className="ProductList-wrapper">
        <animated.div style={stylePropsLeft}>
          <div className="ProductList-bundles">
            {resizeListener}
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
                      limit: products_per_page,
                    }}
                  />
                )}
              />
              <Route
                exact
                path="/:id/:title"
                render={() => <ProductPage {...{ constructorScroll }} />}
              />
            </Switch>
          </div>
        </animated.div>
        <animated.div ref={_constructorref} style={stylePropsRight}>
          <Constructor {...{ size: constructor, setSize: toggleOff }} />
        </animated.div>
      </div>
    </animated.main>
  );
};

const BundlesContainer = ({ products, limit, sortProps, dispatch }) => {
  const { currentPage, controls } = usePagination(products, limit);
  return (
    <>
      <ProductSort {...{ sortProps, dispatch }} />
      <div className="ProductList-bundles-list">
        {currentPage.map((product, index) => (
          <ProductCard {...{ key: index, product }} />
        ))}
      </div>
      <Pages {...controls} />
    </>
  );
};

export default Container;
