import gql from 'graphql-tag';

export const GET_ITEMS = gql`
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

export const GET_ITEM = gql`
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
