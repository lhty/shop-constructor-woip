import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';

import './Auth.css';

const Auth = () => {
  const { toggleDispatch } = useContext(Context);
  return (
    <div
      className="auth"
      onClick={() => {
        toggleDispatch({
          type: 'toggleAuth'
        });
        window.scrollTo(0, 0);
      }}
    ></div>
  );
};

export default Auth;
