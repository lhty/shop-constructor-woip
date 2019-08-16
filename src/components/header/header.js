import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

export default function header() {
  return (
    <div className="header">
      <Link to="/">
        <div className="logo">Sweet dreams</div>
      </Link>
    </div>
  );
}
