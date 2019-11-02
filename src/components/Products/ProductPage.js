import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../Providers/Provider';

import './ProductPage.css';

const Product = ({ match }) => {
  const { ImgUrl } = useContext(Context);
  const id = match.params.id;
  const tbd = 'tbd';

  return (
    <>
      <div className="product-page-back">
        <Link to="/">Назад</Link>
      </div>
      <section className="product-page-container">
        <div className="product-page-left">
          <img src={ImgUrl(tbd)} alt="" />
        </div>
        <div className="product-page-right">
          <h1>{tbd}</h1>
          <p>{tbd}</p>
          <label>{tbd} руб</label>
        </div>
      </section>
    </>
  );
};

export default Product;
