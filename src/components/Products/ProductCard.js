import React, { useContext, useState } from "react";
import { Context } from "../Providers/Provider";
import { Link } from "react-router-dom";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";

import { useSpring, animated } from "react-spring";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { cartDispath } = useContext(Context);

  const [loading, setLoading] = useState(true);

  const loadingStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: loading ? 0 : 1 }
  });

  // backgroundImage: `url(${ThumbnailUrl(product.image)})`

  return (
    <animated.div
      style={loadingStyle}
      key={product.id}
      className="ProductCard-wrapper"
    >
      <Link to={product.id + "/" + product.title}>
        <animated.img
          style={loadingStyle}
          className="ProductCard-thumbnail"
          src={ThumbnailUrl(product.image)}
          alt=""
          onLoad={() => setLoading(false)}
        />
        {/* <p className="ProductCard-title">{product.title}</p> */}
        {/* {loading ? (
        <svg style={{ position: "absolute" }} viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#CCC" />
        </svg>
      ) : null}
      <Link to={product.id + "/" + product.title}>
        <img
          className="ProductCard-thumbnail"
          src={ThumbnailUrl(product.image)}
          alt=""
          onLoad={() => setLoading(false)}
        />
      </Link> */}
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
                image: product.image,
                price: product.price
              }
            });
          }}
        >
          В корзину
        </button>
      </div>
    </animated.div>
  );
};

export default ProductCard;
