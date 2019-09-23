import React, { useContext } from 'react';
import { Context } from './Provider';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';
import Staticinfo from './staticinfo';

const Grid = () => {
  const { PRODUCTS, Setselected } = useContext(Context);
  const { loading, data } = useQuery(PRODUCTS);
  return (
    <>
      <Staticinfo />
      <div className="layout-grid">
        {loading ? (
          <></>
        ) : (
          data.posts.map(product => (
            <Link key={product.id} to={product.id + '/' + product.title}>
              <img
                onClick={() => {
                  Setselected({ id: product.id, title: product.title });
                }}
                key={product.id}
                src={`${API_URL}${product.images[0].url.slice(
                  1,
                  9
                )}thumbnail/th-${product.images[0].url.slice(9)}`}
                alt=""
              />
            </Link>
          ))
        )}
      </div>
    </>
  );
};
export default Grid;
