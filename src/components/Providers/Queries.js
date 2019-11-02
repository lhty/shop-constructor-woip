import gql from 'graphql-tag';
export const BUNDLES_QUERY = gql`
  {
    bundles(sort: "id:desc") {
      id
      title
      show
      price
      proportion {
        id
        type
        shape
        price
        proportion
        countmin
        countmax
        preview {
          url
        }
        x
        y
        z
      }
      items
      image {
        url
      }
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
      image {
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
      shape
      type
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
