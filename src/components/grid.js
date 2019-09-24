import React, { useState, useEffect, useContext } from 'react';
import { Context } from './Provider';
import { useQuery } from 'react-apollo-hooks';
import Staticinfo from './staticinfo';
import Productcard from './productcard';

const Grid = () => {
  const { PRODUCTS } = useContext(Context);
  const { data, error, loading } = useQuery(PRODUCTS);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onCompleted = data => {
      setItems([...data.posts]);
    };
    const onError = error => {
      return <></>;
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);

  return (
    <>
      <Staticinfo />
      <div className="layout-grid">
        {Object.keys(items).length > 0 ? <Productcard product={items} /> : null}
      </div>
    </>
  );
};
export default Grid;
