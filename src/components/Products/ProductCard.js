import React, { useContext, useState } from "react";
import { Context } from "../Providers/Provider";
import { Link } from "react-router-dom";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { ThumbnailUrl, cartDispath } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const style = {
    opacity: "0"
  };
  return (
    <div key={product.id} className="ProductCard-wrapper">
      <p className="ProductCard-title">{product.title}</p>
      <Link to={product.id + "/" + product.title}>
        <img
          style={loading ? style : {}}
          className="ProductCard-thumbnail"
          src={ThumbnailUrl(product.image)}
          alt=""
          onLoad={() => setLoading(false)}
        />
      </Link>
      <div className="hover-buttons">
        <button
          className="hbutton"
          onClick={() => {
            cartDispath({
              type: "CART_ADD",
              payload: {
                id: parseInt(product.id),
                quantity: 1,
                title: product.title,
                image: ThumbnailUrl(product.image),
                price: product.price
              }
            });
          }}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
