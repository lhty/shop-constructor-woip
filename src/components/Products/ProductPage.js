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
    <section className="product-page-container">
      {loading ? (
        <></>
      ) : (
        <>
          <div className="product-page-left">
            <img src={ImgUrl(data.post)} alt="" />
          </div>
          <div className="product-page-right">
            <h1>{data.post.title}</h1>
            <p>{data.post.description}</p>
            <label>{data.post.price} руб.</label>
          </div>
        </>
      )}
    </section>
  );
};

export default Product;
