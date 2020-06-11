import React, { useState, useContext } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo-hooks";
import { API_URL } from "../config";

import { UserContext } from "./UserProvider";
import Maintenance from "../components/StaticInfo/Maintenance";

export default (props) => {
  const { token } = useContext(UserContext);
  const [online, setOnline] = useState(true);

  const authMiddleware = (authToken) =>
    new ApolloLink((operation, forward) => {
      if (authToken) {
        operation.setContext({
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });
      }

      return forward(operation);
    });

  const httpLink = ApolloLink.from([
    onError(({ networkError }) => {
      if (networkError) setOnline(false);
    }),
    new HttpLink({
      uri: `${API_URL}graphql`,
      credentials: "same-origin",
    }),
  ]);

  const cache = new InMemoryCache({});

  const useAppApolloClient = () => {
    return new ApolloClient({
      link: authMiddleware(token).concat(httpLink),
      cache,
    });
  };

  const client = useAppApolloClient();

  return online ? (
    <ApolloProvider client={client}>{props.children}</ApolloProvider>
  ) : (
    <Maintenance />
  );
};
