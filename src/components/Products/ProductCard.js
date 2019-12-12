import React, { useContext, useState } from "react";
import { Context } from "../Providers/Provider";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product, ScreenWidth }) => {
  const { cartDispath } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const loadingStyle = useSpring({
    from: { opacity: 0 },
    opacity: 1
  });

  return (
    <div key={product.id} className="ProductCard-wrapper">
      {(loading || !product) && <div className="ProductCard-placeholder" />}
      <animated.img
        style={loadingStyle}
        src={ThumbnailUrl(product.image, ScreenWidth < 800 && "sm")}
        alt=""
        onLoad={() => setLoading(false)}
        onClick={() => history.push(`${product.id}/${product.title}`)}
      />
      <div className="ProductCard-price">{product.price}</div>
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
        В корзину
      </button>
    </div>
  );
};

export default ProductCard;
