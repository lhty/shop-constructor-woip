import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import Staticinfo from '../StaticInfo/StaticInfo';
import ProductCard from './ProductCard';

import './ProductList.css';

const ProductList = () => {
  const { PRODUCTS } = useContext(Context);
  const { data, error, loading } = useQuery(PRODUCTS);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onCompleted = data => {
      setItems([...data.posts]);
    };
    const onError = error => {
      return <></>;
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);

  return (
    <>
      <Staticinfo />
      <div className="ProductList-wrapper">
        {Object.keys(items).length > 0 ? <ProductCard product={items} /> : null}
      </div>
    </>
  );
};
export default ProductList;
