import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import CartList from '../Cart/CartList';
import Userphoto from '../Auth/Elements/Userphoto';
import AuthPage from '../Auth/AuthPage';
import { UserContext } from '../Providers/UserProvider';

import title from '../../img/title.svg';
import headerborder from '../../img/headerborder.svg';
import './Header.css';

export default function Header({ match: { url } }) {
  const { user, RetrieveLogin, setActive, active } = useContext(UserContext);
  const token = localStorage.getItem('user');

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
            />
          </Link>
          <Cart />
        </div>
        <img className="header-svg" src={headerborder} alt="" />
      </section>
      {active.auth && <AuthPage user={user} />}
      {active.cart && <CartList url={url} />}
    </>
  );
}
