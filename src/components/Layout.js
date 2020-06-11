import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";

import AppoloProvider from "../store/ApolloProvider";
import DataProvider from "../store/DataProvider";
import UserProvider from "../store/UserProvider";

import Header from "./Header/Header";
import Products from "./Products";
import Promo from "./Promo/Promo";
import Staticinfo from "./StaticInfo/StaticInfo";
// import Social from "./Misc/Social";
import Footer from "./Footer/Footer";

import "../css/layout.css";

const Layout = () => {
  return (
    <Router>
      <UserProvider>
        <AppoloProvider>
          <DataProvider>
            <Route component={Header} />
            <Promo />
            <Products />
          </DataProvider>
        </AppoloProvider>
      </UserProvider>
      <Staticinfo />
      {/* <Social /> */}
      <Footer />
    </Router>
  );
};

export default Layout;
