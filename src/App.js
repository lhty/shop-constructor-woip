import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import Layout from './components/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://sweetdreams.ru.com:1337/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/" exact component={Layout} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
