import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ThumbnailUrl } from "../../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const appearance = useSpring({
    from: { opacity: 0, scale: 0 },
    opacity: loading && product.image.length ? 0 : 1,
    scale: loading && product.image.length ? 0 : 1,
    config: { mass: 1, tension: 240, friction: 20 },
  });

  if (product.__typename === "Product")
    return (
      <animated.div style={appearance} className="ProductCard-wrapper">
        {!product.image.length ? (
          <p>{product.name}</p>
        ) : (
          <img
            src={ThumbnailUrl(product.image, window.innerWidth < 800 && "sm")}
            alt=""
            onLoad={() => {
              setLoading(false);
            }}
            onClick={() => history.push(`${product.id}/${product.title}`)}
            draggable="false"
          />
        )}
        <div className="ProductCard-price">
          <p>{product.price}</p>
          <p>₽</p>
        </div>
      </animated.div>
    );

  return (
    <animated.div style={appearance} className="ItemCard-wrapper">
      {!product.image.length ? (
        <p>{product.name}</p>
      ) : (
        <img
          src={ThumbnailUrl(product.image, window.innerWidth < 800 && "sm")}
          alt=""
          onLoad={() => {
            setLoading(false);
          }}
          onClick={() => null}
          draggable="false"
        />
      )}
      <div className="ItemCard-price">
        <p>{product.price}</p>
        <p>₽</p>
      </div>
    </animated.div>
  );
};

export default ProductCard;
