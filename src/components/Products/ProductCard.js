import React, { useContext, useState } from "react";
import { Context } from "../Providers/DataProvider";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product, ScreenWidth }) => {
  const { cartDispath } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loadingStyle = useSpring({
    opacity: loading ? 0 : 1
  });

  return (
    <animated.div
      style={loadingStyle}
      key={product.id}
      className="ProductCard-wrapper"
    >
      <animated.img
        style={loadingStyle}
        src={ThumbnailUrl(product.image, ScreenWidth < 800 && "sm")}
        alt=""
        onLoad={() => setLoading(false)}
        onClick={() => history.push(`${product.id}/${product.title}`)}
        draggable="false"
      />
      <div className="ProductCard-price">
        <p>{product.price}</p>
        <p>₽</p>
      </div>
      {ScreenWidth >= 800 && (
        <button
          className="ProductCard-addbutton"
          onClick={() => {
            cartDispath({
              type: "CART_ADD",
              payload: {
                id: parseInt(product.id),
                quantity: 1,
                title: product.title,
                image: product.image,
                price: product.price
              }
            });
          }}
        >
          <p>в корзину</p>
        </button>
      )}
    </animated.div>
  );
};

export default ProductCard;
