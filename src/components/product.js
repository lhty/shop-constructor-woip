import React, { useContext } from 'react';
import { API_URL } from '../config';
import { Context } from './Provider';
import { useQuery } from 'react-apollo-hooks';

const Product = ({ match }) => {
  const { PRODUCT } = useContext(Context);
  const { loading, data } = useQuery(PRODUCT, {
    variables: { id: match.params.id }
  });
  // const data = products.find(product => product.id === selected);

  // JSON.parse(localStorage.getItem('data'));

  // useEffect(() => {
  //   if (!localStorage.getItem('data')) {
  //     localStorage.setItem('data', JSON.stringify(data));
  //   }
  // });
  // const data = JSON.parse(localStorage.getItem('data'));
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
