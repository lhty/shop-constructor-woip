import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Gallery from "../Gallery/Gallery";
import { Context } from "../../containers/DataProvider";
import { PRODUCT_QUERY } from "../../containers/Queries";
import { useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";

import "./ProductPage.css";

const Product = () => {
  const { setState } = useContext(Context);
  const id = parseInt(useParams().id);

  const {
    output: { filtered: product },
    loading,
  } = useProducts(PRODUCT_QUERY, id);

  if (loading) return null;

  return (
    <main className="product-page-container">
      <div className="product-page-nav">
        <Link to="/">
          <span className="arrow left"></span>Назад
        </Link>
      </div>
      <div className="product-page-left">
        <Gallery image={product.image} />
      </div>
      <div className="product-page-right">
        <button
          disabled={!product.construct}
          onClick={() =>
            product.construct &&
            setState({ current_page: 1, product, details: null })
          }
        >
          В конструктор
        </button>
        <h1>{product.title}</h1>
        <div className="product-page-inside">
          <div className="product-page-inside-expand">
            <p>Состав</p>
          </div>
          {product.items &&
            product.items.map((item) => (
              <p
                key={item.id}
                onClick={() => setState({ current_page: 3, details: item })}
              >
                {item.name} x{" "}
                {product.set.filter((obj) => obj.id === item.id).length}
              </p>
            ))}
        </div>
        <p className="product-page-desc">{product.comment}</p>
        <label>{product.price} руб</label>
      </div>
    </main>
  );
};

export default Product;
