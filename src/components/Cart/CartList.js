import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';

import './CartList.css';

const CartList = () => {
  const { cartDispath, cart, toggleDispatch } = useContext(Context);

  useEffect(() => {
    if (cart.length < 1)
      return toggleDispatch({
        type: 'Clear'
      });
  }, [cart, toggleDispatch]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const list = cart
    .sort((a, b) => b.id - a.id)
    .map((val, i) => (
      <div className="cart-element" key={i}>
        <img className="cart-element-img" src={val.image} alt=""></img>
        {val.title}
        <label className="cart-element-quantity">
          <label
            className="cart-element-remove"
            onClick={() => {
              cartDispath({
                type: 'CART_REMOVE',
                id: val.id,
                quantity: val.quantity
              });
            }}
          >
            -
          </label>
          <label className="cart-element-number">{val.quantity}</label>
          <label
            className="cart-element-add"
            onClick={() => {
              cartDispath({
                type: 'CART_ADD',
                payload: {
                  id: val.id,
                  quantity: val.quantity,
                  title: val.title,
                  image: val.image
                }
              });
            }}
          >
            +
          </label>
        </label>
      </div>
    ));

  return (
    <div className="cart-list-container">
      <div className="cart-list-wrapper">{list}</div>
    </div>
  );
};

export default CartList;