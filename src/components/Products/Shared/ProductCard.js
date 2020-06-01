import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../../../store/Utils";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product, onClick }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const appearance = useSpring({
    from: { opacity: 0, scale: 0 },
    opacity: loading && product.image.length ? 0 : 1,
    scale: loading && product.image.length ? 0 : 1,
    config: { mass: 1, tension: 240, friction: 20 },
  });

  return (
    <animated.div
      style={appearance}
      className={`${product.__typename}Card-wrapper`}
      onClick={() =>
        product.__typename === "Product"
          ? history.push(`${product.id}/${product.title}`)
          : onClick()
      }
    >
      {!product.image.length ? (
        <p>{product.name}</p>
      ) : (
        <img
          src={ThumbnailUrl(product.image, window.innerWidth < 800 && "sm")}
          alt=""
          onLoad={() => {
            setLoading(false);
          }}
          draggable="false"
        />
      )}
      <div className={`${product.__typename}Card-price`}>
        <p>{product.price}</p>
        <p>₽</p>
      </div>
    </animated.div>
  );
};

export default ProductCard;
