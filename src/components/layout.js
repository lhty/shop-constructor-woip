import React from 'react';
import Header from './Header/Header';
import Promo from './Promo/Promo';
import { Route } from 'react-router';
import ProductList from './Products/ProductList';
import ProductPage from './Products/ProductPage';

const Layout = () => {
  return (
    <>
      <Header />
      <Promo />
      <Route exact path="/" component={ProductList} />
      <Route exact path="/:id/:title" component={ProductPage} />
    </>
  );
};

export default Layout;
