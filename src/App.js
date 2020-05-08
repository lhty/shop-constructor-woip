import React, { useState } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo-hooks";
import { API_URL } from "./config";
import Layout from "./components/Layout";
import Maintenance from "./components/StaticInfo/Maintenance";

import "./css/main.css";

function App() {
  const [online, setOnline] = useState(true);

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ networkError }) => {
        if (networkError) setOnline(false);
      }),
      new HttpLink({
        uri: `${API_URL}graphql`,
        credentials: "same-origin",
      }),
    ]),
    cache: new InMemoryCache(),
  });

  return online ? (
    <ApolloProvider client={client}>
      <main className="app">
        <Layout />
      </main>
    </ApolloProvider>
  ) : (
    <Maintenance />
  );
}

export default App;
