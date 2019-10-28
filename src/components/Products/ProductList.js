import React, { useState, useReducer, useMemo } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PRODUCTS_QUERY } from '../Providers/Queries';
import ProductCard from './ProductCard';
import Constructor from '../Constructor/Constructor';

import prodlistsvg from '../../img/productlisttop.svg';
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

  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  const [sortstate, setSortstate] = useState({ byprice: null });
  const [productsort, sortDispatch] = useReducer(sortReducer, {});

  const ConstructorMemo = useMemo(() => <Constructor />, []);

  if (loading || error) return <></>;

  return (
    <section className="ProductList-container">
      <img className="ProductList-topsvg" src={prodlistsvg} alt="" />
      <img className="ProductList-topsvg right" src={prodlistsvg} alt="" />
      <div className="ProductList-wrapper">
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
        {ConstructorMemo}
      </div>
    </section>
  );
};
export default ProductList;
