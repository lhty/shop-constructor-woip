import React, { useContext } from 'react';
import Header from './Header/Header';
import Promo from './Promo/Promo';
import { Route, Switch } from 'react-router';
import ProductList from './Products/ProductList';
import CartList from './Cart/CartList';
import AuthPage from './Auth/AuthPage';
import ProductPage from './Products/ProductPage';
import { Context } from './Providers/Provider';

const Layout = () => {
  const { toggleWhat } = useContext(Context);

  return (
    <>
      <Header />
      <Switch>
        {toggleWhat.toggleCart ? (
          <>
            {toggleWhat.toggleAuth && <Route component={AuthPage} />}
            <Route component={CartList} />
          </>
        ) : (
          <>
            {toggleWhat.toggleAuth && <Route component={AuthPage} />}
            <Route component={Promo} />
          </>
        )}
      </Switch>
      <Route exact path="/" component={ProductList} />
      <Route exact path="/:id/:title" component={ProductPage} />
    </>
  );
};

export default Layout;
