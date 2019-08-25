import React from 'react';
import { GET_ITEM } from './queries/queries';
import { useQuery } from 'react-apollo-hooks';
import { API_URL } from '../../config';

const Item = props => {
  const { data, error, loading } = useQuery(GET_ITEM, {
    variables: { id: props.match.params.title }
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div className="wrapper">
      <h1>{data.post.title}</h1>
      <img src={`${API_URL}${data.post.images[0].url}`} alt="" />
      <p>{data.post.description}</p>
      <label>{data.post.price}</label>
    </div>
  );
};

export default Item;
