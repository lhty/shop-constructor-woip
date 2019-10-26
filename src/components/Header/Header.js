import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import CartList from '../Cart/CartList';
import Auth from '../Auth/Auth';
import AuthPage from '../Auth/AuthPage';
import { UserContext } from '../Providers/UserProvider';

import title from '../../img/title.svg';
import './Header.css';

export default function Header({ match: { url } }) {
  const { setActive, active } = useContext(UserContext);
  return (
    <section className="header">
      <div className="header background"></div>
      <Link to="/">
        <span className="logo-path">
          <img
            className="header-title"
            onClick={() => {
              window.pageYOffset === 0
                ? setActive({ auth: false, cart: false })
                : window.scrollTo(0, 0);
            }}
            src={title}
            alt=""
          />
        </span>
      </Link>
      {header_svg}
      <Auth />
      {active.auth && <AuthPage />}
      <Cart />
      {active.cart && <CartList url={url} />}
    </section>
  );
}

const header_svg = (
  <svg className="header-svg" viewBox="0 6 1920 75" preserveAspectRatio="none">
    <g filter="url(#filter0_d)">
      <path
        d="M1920 62.7565V6H0V73.5C2.14 76.68 5.55 79.7101 11 81.1401C19.53 83.3801 29.78 79.4701 32.74 71.1601C35.48 63.4601 33.51 53.4101 32.37 45.3101C30.32 30.7501 36.98 24.2601 45.14 24.7501C55.42 25.3701 57.41 31.9101 57.49 46.6601C57.6 68.0401 69.14 71.5801 77.22 65.8601C84.69 60.5701 83.95 50.3301 83.9 45.3701C83.76 31.4701 82.99 24.3801 90.27 18.0001C97.22 11.9201 110.82 13.0401 114.68 21.7901C116.91 26.8301 117.894 30.5172 122.41 33.7801C130.542 39.6564 137.97 36.09 148 31.5C157.832 27.0005 230.137 14.526 411.173 7.89292C414.813 7.75953 418.498 7.62851 422.226 7.49997C448.771 6.58486 474.451 6.50106 498.5 7.49992L498.501 7.49997C501.218 7.61283 503.916 7.73565 506.595 7.86807C669.22 15.9061 762.443 59.3463 927.5 62.7565C1122.33 66.7819 1225.99 12.8132 1419.16 7.6304C1420.93 7.58281 1422.71 7.53933 1424.5 7.50004L1424.5 7.49997C1438.04 7.20274 1452.11 7.21676 1466.56 7.49997C1468.34 7.53482 1470.12 7.57374 1471.91 7.61666C1549.65 9.4809 1621.83 48.0602 1715.5 29.4158C1738.38 24.8621 1750.61 7.70336 1773.14 13.7501C1783.64 16.5692 1785 32.5 1797.59 27.0801C1802.71 24.8772 1803.09 20.1301 1805.32 15.0901C1809.18 6.34011 1822.55 9.01011 1829.5 15.0901C1836.78 21.4701 1836.24 24.7701 1836.1 38.6701C1836.05 43.6301 1835.31 53.8701 1842.78 59.1601C1850.86 64.8801 1862.4 61.3401 1862.51 39.9601C1862.59 25.2101 1864.58 18.6701 1874.86 18.0501C1883.02 17.5601 1889.68 24.0501 1887.63 38.6101C1886.49 46.7101 1884.52 56.7601 1887.26 64.4601C1890.22 72.7701 1900.47 76.6801 1909 74.4401C1914.45 73.0101 1917.86 70.4601 1920 67.2801V62.7565Z"
        fill="url(#paint0_linear)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="-9"
        y="0"
        width="1938"
        height="93.763"
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
        y1="20.9064"
        x2="21.5008"
        y2="22.4833"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F9F3EE" />
        <stop offset="0.907011" stopColor="#F2EBE4" />
      </linearGradient>
    </defs>
  </svg>
);
