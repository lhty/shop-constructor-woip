import React, { useContext } from 'react';
import Spinner from '../Assets/Spinner';
import { Link } from 'react-router-dom';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import { PRODUCTS_QUERY } from '../Providers/Queries';

import './ProductPage.css';

const Product = ({ match }) => {
  const { data, error, loading } = useQuery(PRODUCTS_QUERY);

  const { ImgUrl, MakeSet } = useContext(Context);
  const id = match.params.id;

  if (loading || error) return <Spinner />;

  const product = MakeSet(data.products.find(obj => obj.id === id));

  return (
    <>
      <div className="product-page-back">
        <Link to="/">Назад</Link>
      </div>
      <section className="product-page-container">
        <div className="product-page-left">
          <img src={ImgUrl(product)} alt="" />
        </div>
        <div className="product-page-right">
          <h1>{product.title}</h1>
          {product.items.map(item => (
            <p key={item.id}>
              {item.name} x
              {product.setschema.map(
                obj => obj.itemid === parseInt(item.id) && obj.quantity
              )}
            </p>
          ))}
          <label>{product.price} руб</label>
        </div>
      </section>
    </>
  );
};

export default Product;
