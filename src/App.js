import React from 'react';
import ApolloClient from 'apollo-boost';
import Router from './routes';
import { ApolloProvider } from 'react-apollo-hooks';
import { API_URL } from './config';

import './css/index.css';

const client = new ApolloClient({
  uri: `${API_URL}graphql`
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  );
}

export default App;
