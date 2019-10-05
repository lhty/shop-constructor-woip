import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';
import { Link } from 'react-router-dom';

import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { ThumbnailUrl, cartDispath } = useContext(Context);

  return product.map(product => (
    <div key={product.id} className="ProductCard-wrapper">
      <p className="ProductCard-title">{product.title}</p>
      <Link to={product.id + '/' + product.title}>
        <img
          className="ProductCard-thumbnail"
          src={ThumbnailUrl(product)}
          alt=""
        />
      </Link>
      <div className="hover-buttons">
        <div
          className="hbutton"
          onClick={() => {
            cartDispath({
              type: 'CART_ADD',
              payload: {
                id: parseInt(product.id),
                quantity: 1,
                title: product.title,
                image: ThumbnailUrl(product),
                price: product.price
              }
            });
          }}
        ></div>
      </div>
    </div>
  ));
};

export default ProductCard;
