import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Staticinfo from "./StaticInfo/StaticInfo";
import Promo from "./Promo/Promo";
import Social from "./Misc/Social";
import Footer from "./Footer/Footer";
import { BrowserRouter as Router } from "react-router-dom";
import { Route } from "react-router";
import ProductList from "./Products/ProductList";
import UserProvider from "./Providers/UserProvider";

const Layout = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, setWidth]);
  return (
    <Router>
      <UserProvider>
        <Route component={Header} />
        <Promo ScreenWidth={width} />
        {width > 1200 && <Staticinfo />}
        <ProductList ScreenWidth={width} />
      </UserProvider>
      <Social />
      <Footer />
    </Router>
  );
};

export default Layout;
