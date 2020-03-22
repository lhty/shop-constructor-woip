import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product, ScreenWidth }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const container = useSpring({
    from: { opacity: 0 },
    opacity: loading ? 0 : 1
  });

  return (
    <animated.div
      style={container}
      key={product.id}
      className="ProductCard-wrapper"
    >
      <img
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
    </animated.div>
  );
};

export default ProductCard;
