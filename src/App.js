import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import { API_URL } from './config';
import Provider from './components/Provider';
import Layout from './components/layout';
import { BrowserRouter as Router } from 'react-router-dom';

import './css/index.css';

const client = new ApolloClient({
  uri: `${API_URL}graphql`
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
