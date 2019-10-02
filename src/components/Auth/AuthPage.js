import React from 'react';
import SignIn from './SignIn';

import './AuthPage.css';

const AuthPage = () => {
  return (
    <div className="auth-page-container">
      <div className="auth-page-wrapper">
        <SignIn />
      </div>
    </div>
  );
};

export default AuthPage;
