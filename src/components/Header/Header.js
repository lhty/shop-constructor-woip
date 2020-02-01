import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import CartList from "../Cart/CartList";
import Userphoto from "../Auth/Elements/Userphoto";
import AuthPage from "../Auth/AuthPage";
import { UserContext } from "../Providers/UserProvider";

import title from "../../img/title.svg";
import "./Header.css";

export default function Header({ match: { url } }) {
  const { user, RetrieveLogin, setActive, active } = useContext(UserContext);
  const token = localStorage.getItem("user");

  useEffect(() => {
    token && !user.online && RetrieveLogin(token);
  }, [user, token, RetrieveLogin]);

  return (
    <>
      <section className="header">
        <div className="header-nav">
          <span onClick={() => setActive({ ...active, auth: !active.auth })}>
            <Userphoto user={user.online && user} />
          </span>
          <Link to="/">
            <img
              className="header-title"
              onClick={() => {
                window.pageYOffset === 0
                  ? setActive({ auth: false, cart: false })
                  : window.scrollTo(0, 0);
              }}
              src={title}
              alt=""
              draggable="false"
            />
          </Link>
          <Cart />
        </div>
        <svg
          className="header-svg"
          viewBox="0 0 1920 99"
          preserveAspectRatio="none"
        >
          <path
            d="M1920 0H0V41.7565C0 41.7565 304.074 -3.11682 499.5 4.99995C667.167 11.9638 757.224 61.5335 925 65C1121.62 69.0623 1228.38 9.31701 1425 4.99995C1618.8 0.744829 1920 41.7565 1920 41.7565V0Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="2017.5"
              y1="12.8277"
              x2="21.5013"
              y2="14.6602"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F9F3EE" />
              <stop offset="0.907011" stopColor="#F2EBE4" />
            </linearGradient>
          </defs>
        </svg>
      </section>
      {active.auth && <AuthPage user={user} />}
      {active.cart && <CartList url={url} />}
    </>
  );
}
