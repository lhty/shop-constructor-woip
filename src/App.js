import React, { useState } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { API_URL } from './config';
import Provider from './components/Providers/Provider';
import Layout from './components/Layout';
import Maintenance from './components/StaticInfo/Maintenance';
import { BrowserRouter as Router } from 'react-router-dom';

import './css/index.css';

function App() {
  const [online, setOnline] = useState(true);

  const client = new ApolloClient({
    uri: `${API_URL}graphql`,
    cache: new InMemoryCache({
      addTypename: true
    }),
    onError: () => {
      setOnline(false);
    }
  });

  return online ? (
    <ApolloProvider client={client}>
      {console.log(client.cache.data.data)}
      <Provider>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </ApolloProvider>
  ) : (
    <Maintenance />
  );
}

export default App;
