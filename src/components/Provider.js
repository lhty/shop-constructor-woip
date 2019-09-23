import React, { useState } from 'react';
import gql from 'graphql-tag';

const PRODUCTS = gql`
  {
    posts(sort: "id:desc") {
      id
      title
      price
      images {
        url
      }
    }
  }
`;
const PRODUCT = gql`
  query($id: ID!) {
    post(id: $id) {
      id
      title
      description
      price
      images {
        url
      }
    }
  }
`;
const PROMO = gql`
  {
    promos(sort: "id:desc") {
      promo_banners {
        url
      }
    }
  }
`;

export const Context = React.createContext();

const Provider = props => {
  const [selected, Setselected] = useState({ id: 0, title: '' });

  return (
    <Context.Provider
      value={{
        PRODUCTS,
        PRODUCT,
        PROMO,
        selected,
        Setselected
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
