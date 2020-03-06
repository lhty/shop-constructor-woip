import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Staticinfo from "./StaticInfo/StaticInfo";
import Promo from "./Promo/Promo";
import Footer from "./Footer/Footer";
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
    <>
      <UserProvider>
        <Route component={Header} />
        <Promo ScreenWidth={width} />
        {width > 1200 && <Staticinfo />}
        <ProductList ScreenWidth={width} />
      </UserProvider>
      <Footer />
    </>
  );
};

export default Layout;
