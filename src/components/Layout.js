import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";

import UserProvider from "../containers/UserProvider";

import Header from "./Header/Header";
import Products from "./Products";
import Promo from "./Promo/Promo";
import Staticinfo from "./StaticInfo/StaticInfo";
import Social from "./Misc/Social";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <Router>
      <UserProvider>
        <Route component={Header} />
        <Promo />
        <Products />
      </UserProvider>
      <Staticinfo />
      <Social />
      <Footer />
    </Router>
  );
};

export default Layout;
