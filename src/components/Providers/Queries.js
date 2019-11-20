import gql from "graphql-tag";
export const PRODUCTS_QUERY = gql`
  {
    products(sort: "id:desc") {
      id
      title
      comment
      show
      tags {
        name
      }
      image {
        url
      }
      schema
      user {
        username
        id
      }
      construct
      proportion {
        id
        type
        shape
        price
        proportion
        construct
        countmin
        countmax
        image {
          url
        }
        x
        y
        z
      }
      items {
        id
        name
        description
        weight
        chocolate
        price
        discount
        taste
        letter
        difficult
        size_width
        size_height
        size_length
        quantity
        construct
        editable
        image {
          url
        }
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
      shape
      type
      price
      tags {
        name
      }
      image {
        url
      }
      countmin
      countmax
      construct
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
      construct
      editable
      taste
      tags {
        name
      }
      letter
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
