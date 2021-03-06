import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Gallery from "../Gallery/Gallery";
import { Context } from "../../store/DataProvider";

import { useQuery } from "react-apollo-hooks";
import { PRODUCT_QUERY } from "../../store/Queries";

import { useParams } from "react-router-dom";
import { useSort } from "../../hooks/useSort";

import "./ProductPage.css";
import SlideFade from "../Effects/SlideFade";

const Product = () => {
  const { setState } = useContext(Context);
  const id = parseInt(useParams().id);

  const { data } = useQuery(PRODUCT_QUERY, { variables: { id } });

  const {
    output: { filtered: product },
  } = useSort(data?.product);

  return (
    <SlideFade condition={true} dist={100}>
      <div className="product-page-container">
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
            hidden={!product.construct}
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
              <p>Внутри :</p>
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
      </div>
    </SlideFade>
  );
};

export default Product;
