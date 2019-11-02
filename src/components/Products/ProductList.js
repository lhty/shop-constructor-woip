import React, { useState, useReducer, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import { BUNDLES_QUERY } from '../Providers/Queries';
import Spinner from '../Assets/Spinner';
import ProductPage from './ProductPage';
import ProductCard from './ProductCard';
import Constructor from '../Constructor/Constructor';

import sortprice from '../../img/sort-byprice.svg';
import sortsize from '../../img/sort-bypsize.svg';
import prodlistsvg from '../../img/productlisttop.svg';
import './ProductList.css';

const ProductList = () => {
  const ConstructorMemo = useMemo(() => <Constructor />, []);

  return (
    <section className="ProductList-container">
      <img className="ProductList-topsvg" src={prodlistsvg} alt="" />
      <img className="ProductList-topsvg right" src={prodlistsvg} alt="" />
      <div className="ProductList-wrapper">
        <div className="ProductList-bundles">
          <Switch>
            <Route exact path="/" component={Bundles} />
            <Route exact path="/:id/:title" component={ProductPage} />
          </Switch>
        </div>
        {ConstructorMemo}
      </div>
    </section>
  );
};

const Bundles = () => {
  function sortReducer(state, action) {
    switch (action.type) {
      case 'BY_PRICE':
        return {
          ...state,
          ...action.payload.sort((a, b) =>
            sortstate.byprice ? a.price - b.price : b.price - a.price
          )
        };
      case 'BY_SIZE':
        return {
          ...state,
          ...action.payload.sort((a, b) =>
            sortstate.bysize ? a.price - b.price : b.price - a.price
          )
        };
      default:
        return action.payload;
    }
  }

  const { data, error, loading } = useQuery(BUNDLES_QUERY);

  const [sortstate, setSortstate] = useState({ byprice: null, bysize: null });
  const [productsort, sortDispatch] = useReducer(sortReducer, {});
  if (loading || error) return <Spinner />;
  return (
    <>
      <div className="ProductList-bundles-sort">
        <div
          className={
            sortstate.byprice === null ? 'sort-by inactive' : 'sort-by'
          }
          onClick={() => {
            sortDispatch({ type: 'BY_PRICE', payload: data.bundles });
            setSortstate({ ...sortstate, byprice: !sortstate.byprice });
          }}
        >
          по цене
          <img
            className={
              sortstate.byprice === null
                ? 'hidden'
                : sortstate.byprice
                ? ''
                : 'reversed'
            }
            src={sortprice}
            alt=""
          />
        </div>
        <div
          className={sortstate.bysize === null ? 'sort-by inactive' : 'sort-by'}
          onClick={() => {
            sortDispatch({ type: 'BY_SIZE', payload: data.bundles });
            setSortstate({ ...sortstate, bysize: !sortstate.bysize });
          }}
        >
          по размеру
          <img
            className={
              sortstate.bysize === null
                ? 'hidden'
                : sortstate.bysize
                ? ''
                : 'small'
            }
            src={sortsize}
            alt=""
          />
        </div>
      </div>
      <ProductCard
        product={(productsort.length > 0 && productsort) || data.bundles}
      />
    </>
  );
};

export default ProductList;
