import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';

import './ProductPage.css';

const Product = ({ match }) => {
  const { ImgUrl, PRODUCT_QUERY } = useContext(Context);
  const { loading, data } = useQuery(PRODUCT_QUERY, {
    variables: { id: match.params.id }
  });

  return (
    <section className="ProductPage-wrapper">
      {loading ? (
        <></>
      ) : (
        <>
          <h1>{data.post.title}</h1>
          <img src={ImgUrl(data.post)} alt="" />
          <p>{data.post.description}</p>
          <label>{data.post.price}</label>
        </>
      )}
    </section>
  );
};

export default Product;
