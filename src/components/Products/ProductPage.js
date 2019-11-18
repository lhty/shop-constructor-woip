import React, { useContext, useState } from "react";
import Spinner from "../Assets/Spinner";
import { Link } from "react-router-dom";
import { Context } from "../Providers/Provider";
import { useQuery } from "react-apollo-hooks";
import { PRODUCTS_QUERY } from "../Providers/Queries";

import "./ProductPage.css";

const Product = ({ match }) => {
  const [expand, setExpand] = useState(false);
  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  const { ImgUrl, MakeBundle, setConstruct } = useContext(Context);
  const id = match.params.id;

  if (loading || error) return <Spinner />;

  const product = MakeBundle(data.products.find(obj => obj.id === id));

  return (
    <section className="product-page-container">
      <div className="product-page-nav">
        <Link to="/">Назад</Link>
        <button onClick={() => setConstruct(product)}>В конструктор</button>
      </div>
      <div className="product-page-left">
        <img src={ImgUrl(product)} alt="" draggable="false" />
      </div>
      <div className="product-page-right">
        <h1>{product.title}</h1>
        <div className="product-page-inside">
          <span
            className="product-page-inside-expand"
            onClick={() => setExpand(!expand)}
          ></span>
          {expand &&
            product.items.map(item => (
              <p
                key={item.id}
                onClick={() => setConstruct({ ...product, details: item.id })}
              >
                {item.name} x{" "}
                {
                  product.set.filter(
                    obj => parseInt(obj.id) === parseInt(item.id)
                  ).length
                }
              </p>
            ))}
        </div>
        <p className="product-page-desc">{product.comment}</p>
      </div>
      <label>{product.price} руб</label>
    </section>
  );
};

export default Product;
