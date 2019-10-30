import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Auth/Elements/Spinner';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import { PRODUCT_QUERY } from '../Providers/Queries';

import './ProductPage.css';

const Product = ({ match }) => {
  const { ImgUrl } = useContext(Context);
  const { data, loading, error } = useQuery(PRODUCT_QUERY, {
    variables: { id: match.params.id }
  });

  if (loading || error) return <Spinner />;

  return (
    <>
      <div className="product-page-back">
        <Link to="/">Назад</Link>
      </div>
      <section className="product-page-container">
        <div className="product-page-left">
          <img src={ImgUrl(data.post)} alt="" />
        </div>
        <div className="product-page-right">
          <h1>{data.post.title}</h1>
          <p>{data.post.description}</p>
          <label>{data.post.price} руб</label>
        </div>
      </section>
    </>
  );
};

export default Product;
