import React, { useRef } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import { API_URL } from './config';
import Provider from './components/Providers/Provider';
import Layout from './components/Layout';
import Maintenance from './components/StaticInfo/Maintenance';
import { BrowserRouter as Router } from 'react-router-dom';

import './css/index.css';

function App() {
  const online = useRef(true);

  const client = new ApolloClient({
    uri: `${API_URL}graphql`,
    onError: () => {
      online.current = false;
    }
  });

  return online.current ? (
    <ApolloProvider client={client}>
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
