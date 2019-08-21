import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import './items.css';

const GET_ITEMS = gql`
  {
    articl {
      title
    }
  }
`;

const Items = () => {
  const { data, error, loading } = useQuery(GET_ITEMS);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <ul>
      {/* {data.articl.map(item => (
        <li key={item.id}>{item.title}</li>
      ))} */}
      {console.log(data)}
    </ul>
  );
};

export default Items;
