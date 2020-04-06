import React, { useState, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { PRODUCTS_QUERY } from "../Providers/Queries";
import ProductPage from "./ProductPage";
import ProductCard from "./ProductCard";
import ProductSort from "./ProductSort";
import Constructor from "./Constructor/Constructor";

import { useSpring, animated } from "react-spring";
import useResizeAware from "react-resize-aware";

import { usePagination } from "../Hooks/usePagination";
import useProducts from "../Hooks/useProducts";

import "./index.css";

const Container = () => {
  const [size, setSize] = useState();

  const _constructorref = useRef(null);
  const constructorScroll = () =>
    window.innerWidth < 1320 &&
    window.scrollTo(0, _constructorref.current.offsetTop * 2);

  const {
    output: { filtered, sortProps },
    dispatch
  } = useProducts(PRODUCTS_QUERY);

  const { page, list } = usePagination(filtered, 5);

  const stylePropsLeft = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width: window.innerWidth > 1320 ? (size ? `50%` : `80%`) : `100%`
  });

  const stylePropsRight = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width: window.innerWidth > 1320 ? (size ? `50%` : `20%`) : `100%`
  });

  const [resizeListener, sizes] = useResizeAware();
  const smoothHeight = useSpring({
    from: { height: 0 },
    height: sizes.height
  });

  return (
    <animated.main style={smoothHeight} className="ProductList-container">
      {console.log(`page`, page, `list`, list)}
      <div className="ProductList-wrapper">
        <animated.div style={stylePropsLeft}>
          <div className="ProductList-bundles">
            {resizeListener}
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Bundles
                    {...{
                      products: filtered,
                      sortProps,
                      dispatch
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
          <Constructor {...{ size, setSize }} />
        </animated.div>
      </div>
    </animated.main>
  );
};

const Bundles = ({ products, sortProps, dispatch }) => {
  return (
    <>
      <ProductSort {...{ sortProps, dispatch }} />
      <div className="ProductList-bundles-list">
        {products.map((product, index) => (
          <ProductCard {...{ key: index, product }} />
        ))}
      </div>
      {/* <Pagination
        {...{
          length: products.length,
          limit: 8
        }}
      /> */}
    </>
  );
};

export default Container;
