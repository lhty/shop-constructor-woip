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
          <g filter="url(#filter0_d)">
            <path
              d="M1920 0H0V63.2565C0 63.2565 304.074 18.3832 499.5 26.5C667.167 33.4639 757.224 83.0336 925 86.5C1121.62 90.5624 1228.38 30.8171 1425 26.5C1618.8 22.2449 1920 63.2565 1920 63.2565V0Z"
              fill="url(#paint0_linear)"
            />
          </g>
          <defs>
            <filter
              id="filter0_d"
              x="-9"
              y="-5"
              width="1938"
              height="96.698"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="4.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear"
              x1="2017.5"
              y1="16.4838"
              x2="21.5007"
              y2="18.002"
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
