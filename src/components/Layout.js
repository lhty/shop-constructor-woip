import React from "react";
import Header from "./Header/Header";
import Staticinfo from "./StaticInfo/StaticInfo";
import Promo from "./Promo/Promo";
import Footer from "./Footer/Footer";
import { Route } from "react-router";
import ProductList from "./Products/ProductList";
import UserProvider from "./Providers/UserProvider";

const Layout = () => {
  return (
    <div className="wrapper">
      <UserProvider>
        <Route component={Header} />
        <Promo />
        <Staticinfo />
        <ProductList />
      </UserProvider>
      <Footer />
    </div>
  );
};

export default Layout;
