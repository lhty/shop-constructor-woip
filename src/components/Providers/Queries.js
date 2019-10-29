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
      title
      description
      promo_banners {
        url
      }
    }
  }
`;
export const PROPORTION_QUERY = gql`
  {
    proportions(sort: "id:desc") {
      id
      x
      y
      z
      countmin
      countmax
    }
  }
`;
export const ITEM_QUERY = gql`
  {
    items(sort: "id:desc") {
      id
      name
      description
      weight
      chocolate
      price
      discount
      taste
      difficult
      size_width
      size_height
      size_length
      image {
        url
      }
    }
  }
`;
