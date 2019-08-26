import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import Logo from './logo';

export default function header() {
  return (
    <div className="header">
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );
}
