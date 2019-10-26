import React from 'react';
import Header from './Header/Header';
import Staticinfo from './StaticInfo/StaticInfo';
import Promo from './Promo/Promo';
import { Route } from 'react-router';
import ProductList from './Products/ProductList';
import ProductPage from './Products/ProductPage';
import UserProvider from './Providers/UserProvider';

const Layout = () => {
  return (
    <div className="wrapper">
      <UserProvider>
        <Route component={Header} />
        <Route component={Promo} />
      </UserProvider>
      <Staticinfo />
      <Route exact path="/" component={ProductList} />
      <Route exact path="/:id/:title" component={ProductPage} />
    </div>
  );
};

export default Layout;
