import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import Logo from './logo';
import VK, { Auth } from 'react-vk';

export default function header() {
  return (
    <div className="header">
      <Link to="/">
        <Logo />
        <VK apiId={6870521}>
          <Auth />
        </VK>
      </Link>
    </div>
  );
}
