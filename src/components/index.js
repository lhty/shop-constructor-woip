import React from 'react';
import './index.css';
import Header from './header/header';
import Items from './items/items';

function Layout() {
  return (
    <>
      <div className="Layout">
        <Header />
        <Items />
      </div>
    </>
  );
}

export default Layout;
