import gql from 'graphql-tag';

export const PRODUCTS_QUERY = gql`
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
export const PRODUCT_QUERY = gql`
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
export const PROMO_QUERY = gql`
  {
    promos(sort: "id:desc") {
      promo_banners {
        url
      }
    }
  }
`;
