import React from 'react';
import Header from './header';
import Promo from './promo';
import { Route } from 'react-router';
import Grid from './grid';

import Product from './product';
import './layout.css';

const Layout = () => {
  return (
    <>
      <Header />
      <Promo />
      <Route exact path="/" component={Grid} />
      <Route exact path="/:id/:title" component={Product} />
    </>
  );
};

export default Layout;
