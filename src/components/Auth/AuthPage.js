import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';

import './AuthPage.css';

const AuthPage = () => {
  const { user } = useContext(Context);
  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        {user ? (
          <Profile />
        ) : (
          <>
            <Signup />
            <Login />
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
