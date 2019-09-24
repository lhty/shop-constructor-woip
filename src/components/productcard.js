import React, { useContext } from 'react';
import { Context } from './Provider';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';

const Productcard = products => {
  const { cart, setCart } = useContext(Context);

  return products.product.map(product => (
    <Link key={product.id} to={product.id + '/' + product.title}>
      <img
        onClick={() => {
          setCart([...cart, parseInt(product.id)]);
        }}
        key={product.id}
        src={`${API_URL}${product.images[0].url.slice(
          1,
          9
        )}thumbnail/th-${product.images[0].url.slice(9)}`}
        alt=""
      />
    </Link>
  ));
};

export default Productcard;
