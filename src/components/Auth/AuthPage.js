import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile/Profile';

import './AuthPage.css';

const AuthPage = ({ user }) => {
  const [active, setActive] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        {user.online ? (
          <Profile user={user} />
        ) : (
          <>
            <h1
              className={active ? 'auth-page auth-active' : 'auth-page'}
              onClick={() => setActive(!active)}
            >
              Вход
            </h1>
            <h1
              className={!active ? 'auth-page auth-active' : 'auth-page'}
              onClick={() => setActive(!active)}
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
