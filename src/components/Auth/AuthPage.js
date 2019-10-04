import React from 'react';
import Signup from './Signup';
import Login from './Login';

import './AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        <Signup />
        <Login />
      </div>
    </div>
  );
};

export default AuthPage;
