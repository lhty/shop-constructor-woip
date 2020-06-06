import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { Context } from "../../store/DataProvider";

import "./index.css";

export default ({ products = [] }) => {
  const product = products[Math.floor(Math.random() * products.length)];
  const item = product?.items[Math.floor(Math.random() * product.items.length)];

  return (
    <section className="Featured-container">
      <FeaturedProduct product={product} />
      <FeaturedItem item={item} />
    </section>
  );
};

const FeaturedProduct = ({ product }) => {
  const history = useHistory();

  return (
    <div
      className="Featured-product main-bg"
      onClick={() =>
        product && history.replace(`/${product.id}/${product.title}`)
      }
    >
      Featured-product: {product?.title}
    </div>
  );
};

const FeaturedItem = ({ item }) => {
  const { setState } = useContext(Context);
  return (
    <div
      className="Featured-item main-bg"
      onClick={() => item && setState({ current_page: 3, details: item })}
    >
      Featured-item: {item?.name}
    </div>
  );
};
