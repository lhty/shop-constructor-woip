import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';

import './Auth.css';

const Auth = () => {
  const { toggleDispatch, user, userDispatch } = useContext(Context);

  useEffect(() => {
    return localStorage.getItem('user')
      ? userDispatch({ type: 'temp' })
      : undefined;
  }, [userDispatch]);

  return (
    <div
      className={user ? 'auth' : 'auth authFalse'}
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
