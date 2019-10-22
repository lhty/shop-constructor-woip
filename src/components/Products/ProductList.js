import React, { useContext, useState, useReducer } from 'react';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import Staticinfo from '../StaticInfo/StaticInfo';
import ProductCard from './ProductCard';

import './ProductList.css';

const ProductList = () => {
  function sortReducer(state, action) {
    switch (action.type) {
      case 'BY_PRICE':
        return {
          ...state,
          ...action.payload.sort((a, b) =>
            sortstate.byprice ? a.price - b.price : b.price - a.price
          )
        };
      default:
        return action.payload;
    }
  }

  const { PRODUCTS_QUERY } = useContext(Context);
  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  const [sortstate, setSortstate] = useState({ byprice: null });
  const [productsort, sortDispatch] = useReducer(sortReducer, {});

  if (loading || error) return <></>;

  return (
    <>
      <Staticinfo />
      <section className="ProductList-container">
        <div className="ProductList-bundles">
          <div className="ProductList-bundles-sort">
            <div
              className={
                sortstate.byprice === null
                  ? 'sort-byprice inactive'
                  : 'sort-byprice'
              }
              onClick={() => {
                sortDispatch({ type: 'BY_PRICE', payload: data.posts });
                setSortstate({ ...sortstate, byprice: !sortstate.byprice });
              }}
            >
              по цене
            </div>
            <span
              className={
                sortstate.byprice === null
                  ? 'sort-byprice-link hidden'
                  : sortstate.byprice
                  ? 'sort-byprice-link'
                  : 'sort-byprice-link reversed'
              }
            ></span>
          </div>
          <ProductCard
            product={(productsort.length > 0 && productsort) || data.posts}
          />
        </div>
      </section>
    </>
  );
};
export default ProductList;
