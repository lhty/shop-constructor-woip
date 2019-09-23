import React, { useContext } from 'react';
import { API_URL } from '../config';
import { Context } from './Provider';
import { useQuery } from 'react-apollo-hooks';

const Product = ({ match }) => {
  const { PRODUCT } = useContext(Context);
  const { loading, data } = useQuery(PRODUCT, {
    variables: { id: match.params.id }
  });

  return (
    <section className="product">
      {loading ? (
        <></>
      ) : (
        <>
          <h1>{data.post.title}</h1>
          <img src={`${API_URL}${data.post.images[0].url}`} alt="" />
          <p>{data.post.description}</p>
          <label>{data.post.price}</label>
        </>
      )}
    </section>
  );
};

export default Product;
