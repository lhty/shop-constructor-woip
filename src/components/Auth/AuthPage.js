import React, { useState, useContext } from 'react';
import { Context } from '../Providers/Provider';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile/Profile';

import './AuthPage.css';

const AuthPage = () => {
  const [active, setActive] = useState(true);
  const { user } = useContext(Context);
  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        {user ? (
          <Profile />
        ) : (
          <>
            <h1
              className={
                active ? 'auth-page-title auth-active' : 'auth-page-title'
              }
              onClick={() => setActive(true)}
            >
              Вход
            </h1>
            <h1
              className={
                !active ? 'auth-page-link auth-active' : 'auth-page-link'
              }
              onClick={() => setActive(false)}
            >
              Регистрация
            </h1>
            {active ? <Login /> : <Signup />}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
