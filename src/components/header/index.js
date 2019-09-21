import React from 'react';
import './header.css';
import Logo from './logo';
import { Link } from 'react-router-dom';

export default function header() {
  return (
    <section className="header">
      <div className="top-panel">
        <Link to="/">
          <Logo />
          <div>LOGIN/LOGOUT</div>
        </Link>
        {bottomlabel}
      </div>
    </section>
  );
}
const bottomlabel = (
  <svg
    className="top-menu-label"
    viewBox="0 0 1900 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d)">
      <path
        d="M4 0.443066L1904 0.442993L952 50.443L4 0.443066Z"
        fill="#F9F3EE"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0"
        y="0.45"
        width="1900"
        height="58"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
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
    </defs>
  </svg>
);
