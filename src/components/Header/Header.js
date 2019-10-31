import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import CartList from '../Cart/CartList';
import Auth from '../Auth/Auth';
import AuthPage from '../Auth/AuthPage';
import { UserContext } from '../Providers/UserProvider';

import title from '../../img/title.svg';
import headerborder from '../../img/headerborder.svg';
import './Header.css';

export default function Header({ match: { url } }) {
  const { setActive, active } = useContext(UserContext);
  return (
    <>
      <section className="header">
        <div className="header-nav">
          <Auth />
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
            />
          </Link>
          <Cart />
        </div>
        <img className="header-svg" src={headerborder} alt="" />
      </section>
      {active.auth && <AuthPage />}
      {active.cart && <CartList url={url} />}
    </>
  );
}
