import React, { useContext } from 'react';
import Header from './Nav/Headernav';
import Promo from './Promo/Promo';
import { Route, Switch } from 'react-router';
import ProductList from './Products/ProductList';
import CartList from './Cart/CartList';
import Authpage from './Auth/Authpage';
import ProductPage from './Products/ProductPage';
import { Context } from './Providers/Provider';

const Layout = () => {
  const { toggleWhat } = useContext(Context);
  return (
    <>
      <Header />
      <Switch>
        {!toggleWhat.toggleAuth && !toggleWhat.toggleCart ? (
          <Route component={Promo} />
        ) : null}
        {toggleWhat.toggleCart ? <Route component={CartList} /> : null}
        {toggleWhat.toggleAuth ? <Route component={Authpage} /> : null}
      </Switch>
      <Route exact path="/" component={ProductList} />
      <Route exact path="/:id/:title" component={ProductPage} />
    </>
  );
};

export default Layout;
