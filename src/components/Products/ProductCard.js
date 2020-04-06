import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const appearance = useSpring({
    from: { opacity: 0, scale: 0 },
    opacity: loading ? 0 : 1,
    scale: loading ? 0 : 1,
    config: { mass: 1, tension: 240, friction: 20 }
  });

  return (
    <div className="ProductCard-wrapper">
      {loading && <div className="loading"></div>}
      <animated.img
        style={appearance}
        src={ThumbnailUrl(product.image, window.innerWidth < 800 && "sm")}
        alt=""
        onLoad={() => {
          setLoading(false);
        }}
        onClick={() => history.push(`${product.id}/${product.title}`)}
        draggable="false"
      />
      <animated.div style={appearance} className="ProductCard-price">
        <p>{product.price}</p>
        <p>₽</p>
      </animated.div>
    </div>
  );
};

export default ProductCard;
