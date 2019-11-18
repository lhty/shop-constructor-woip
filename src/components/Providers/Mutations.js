import gql from "graphql-tag";

export const CREATE_PRODUCT = gql`
  {
    createProduct(
      input: {
        data: {
          title: "test"
          user: 1
          show: false
          proportion: 1
          items: [1, 3, 2]
        }
      }
    ) {
      product {
        title
        show
        user {
          id
        }
        proportion {
          id
        }
        items {
          id
        }
      }
    }
  }
`;
