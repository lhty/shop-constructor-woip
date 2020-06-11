import React from "react";
import { useToken } from "../hooks/useToken";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";

import AppoloProvider from "../store/ApolloProvider";
import DataProvider from "../store/DataProvider";
import UserProvider from "../store/UserProvider";

import Header from "./Header/Header";
import Products from "./Products";
import Promo from "./Promo/Promo";
import Staticinfo from "./StaticInfo/StaticInfo";
import Footer from "./Footer/Footer";

import "../css/layout.css";

const Layout = () => {
  const [token, setToken] = useToken();
  return (
    <Router>
      <AppoloProvider {...{ token }}>
        <UserProvider {...{ token, setToken }}>
          <DataProvider>
            <Route component={Header} />
            <Promo />
            <Products />
          </DataProvider>
        </UserProvider>
      </AppoloProvider>
      <Staticinfo />
      <Footer />
    </Router>
  );
};

export default Layout;
