import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/DataProvider";
import { ThumbnailUrl } from "../../store/Utils";

import "./CartList.css";

const CartList = ({ url }) => {
  const { cartDispath, cart } = useContext(Context);
  const list = cart
    .sort((a, b) => b.id - a.id)
    .map((item) => (
      <div className="cart-element" key={item.id}>
        <Link
          className="cart-element-description"
          to={{ pathname: `${url}${item.id}/${item.title}` }}
        >
          <img
            className="cart-element-img"
            src={ThumbnailUrl(item.image)}
            alt=""
          ></img>
          <p>{item.title}</p>
        </Link>
        <label className="cart-element-quantity">
          <label
            className="action remove"
            onClick={() => {
              cartDispath({
                type: "CART_REMOVE",
                id: item.id,
                quantity: item.quantity,
              });
            }}
          >
            -
          </label>
          <label className="action number">{item.quantity}</label>
          <label
            className="action add"
            onClick={() => {
              cartDispath({
                type: "CART_ADD",
                payload: {
                  id: item.id,
                  quantity: item.quantity,
                  title: item.title,
                  image: item.image,
                  price: item.price,
                },
              });
            }}
          >
            +
          </label>
        </label>
      </div>
    ));

  return (
    cart.length > 0 && (
      <div className="cart-list-wrapper">
        {list}
        <div className="cart-list-checkout">
          <button className="cart-list-proceed">Продолжить</button>
          <h1 className="cart-list-overallprice">
            {cart.reduce((acc, obj) => acc + obj.price * obj.quantity, 0)} руб
          </h1>
        </div>
      </div>
    )
  );
};

export default CartList;
