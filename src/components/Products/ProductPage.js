import React, { useContext } from "react";
import Gallery from "../Gallery/Gallery";
import { Link } from "react-router-dom";
import { Context } from "../Providers/DataProvider";
import { PRODUCT_QUERY } from "../Providers/Queries";
import { useParams } from "react-router-dom";
import useProducts from "../Hooks/useProducts";

import "./ProductPage.css";

const Product = ({ constructorScroll }) => {
  const { setConstruct } = useContext(Context);
  const id = parseInt(useParams().id);

  const {
    output: { filtered: product },
    loading
  } = useProducts(PRODUCT_QUERY, id);

  const contructStyle = {
    on: {
      cursor: `pointer`
    },
    off: {
      cursor: `normal`,
      filter: `grayscale(100%)`,
      opacity: `0.3`
    }
  };

  if (loading) return null;

  return (
    <main className="product-page-container">
      <div className="product-page-nav">
        <Link to="/">
          <span className="arrow left"></span>Назад
        </Link>
        <button
          style={product.construct ? contructStyle.on : contructStyle.off}
          onClick={() =>
            product.construct && (setConstruct(product), constructorScroll())
          }
        >
          В конструктор
        </button>
      </div>
      <div className="product-page-left">
        <Gallery image={product.image} />
      </div>
      <div className="product-page-right">
        <h1>{product.title}</h1>
        <div className="product-page-inside">
          <div className="product-page-inside-expand">
            <p>Состав</p>
          </div>
          {product.items &&
            product.items.map(item => (
              <p
                key={item.id}
                onClick={() => setConstruct({ ...product, details: item.id })}
              >
                {item.name} x{" "}
                {product.set.filter(obj => obj.id === item.id).length}
              </p>
            ))}
        </div>
        <p className="product-page-desc">{product.comment}</p>
      </div>
      <label>{product.price} руб</label>
    </main>
  );
};

export default Product;
