import React from 'react';
import { GET_ITEMS } from './queries/queries';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';

import { API_URL } from '../../config';
import './items.css';

const Items = () => {
  const { data, error, loading } = useQuery(GET_ITEMS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div className="Cards">
      {data.posts.map(item => (
        <Link
          to={{
            pathname: `${item.id}`,
            props: { item }
          }}
          key={item.id}
          className="Card"
        >
          <img src={`${API_URL}${item.images[0].url}`} alt="" />
          <h2>{item.title}</h2>
          <h2>{item.price}</h2>
        </Link>
      ))}
    </div>
  );
};

export default Items;
