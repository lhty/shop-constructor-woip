import React, { useState } from 'react';
import gql from 'graphql-tag';
// import { useQuery } from 'react-apollo-hooks';

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

export const Context = React.createContext();

// export const Getdata = val => {
//   const { data, error, loading } = useQuery(val);
//   if (data) {
//     return data;
//   }
//   if (loading) {
//     return <></>;
//   }
//   if (error) {
//     return <>{console.log(error.message)}</>;
//   }
// };

const Provider = props => {
  const [selected, Setselected] = useState();
  const [selectedtitle, Setselectedtitle] = useState();

  return (
    <Context.Provider
      value={{
        PRODUCTS,
        PRODUCT,
        selected,
        Setselected,
        selectedtitle,
        Setselectedtitle
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
