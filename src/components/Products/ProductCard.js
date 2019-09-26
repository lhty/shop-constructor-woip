import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';
import { API_URL } from '../../config';
import { Link } from 'react-router-dom';

import './ProductCard.css';

const ProductCard = products => {
  const { cart, setCart } = useContext(Context);

  return products.product.map(product => (
    <div key={product.id} className="ProductCard-wrapper">
      <p className="ProductCard-title">{product.title}</p>
      <Link to={product.id + '/' + product.title}>
        <img
          className="ProductCard-thumbnail"
          src={`${API_URL}${product.images[0].url.slice(
            1,
            9
          )}thumbnail/th-${product.images[0].url.slice(9)}`}
          alt=""
        />
      </Link>
      <div className="hover-buttons">
        <div
          className="hbutton"
          onClick={() => {
            setCart([...cart, product]);
          }}
        ></div>
      </div>
    </div>
  ));
};

export default ProductCard;
