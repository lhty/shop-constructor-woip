import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import Staticinfo from '../StaticInfo/StaticInfo';
import ProductCard from './ProductCard';

import './ProductList.css';

const ProductList = () => {
  const { PRODUCTS_QUERY } = useContext(Context);
  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  if (loading || error) return <></>;

  return (
    <>
      <Staticinfo />
      <section className="ProductList-container">
         <ProductCard product={data.posts} />
      </section>
    </>
  );
};
export default ProductList;
