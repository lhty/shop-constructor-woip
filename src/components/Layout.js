import React from "react";
import Header from "./Header/Header";
import Staticinfo from "./StaticInfo/StaticInfo";
import Promo from "./Promo/Promo";
import Social from "./Misc/Social";
import Footer from "./Footer/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";
import Products from "./Products";
import UserProvider from "./Providers/UserProvider";

const Layout = () => {
  return (
    <Router>
      <UserProvider>
        <Route component={Header} />
        <Promo />
        <Staticinfo />
        <Products />
      </UserProvider>
      <Social />
      <Footer />
    </Router>
  );
};

export default Layout;
