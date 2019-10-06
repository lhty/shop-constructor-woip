import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';
import axios from 'axios';
import { API_URL } from '../../config';

import './Auth.css';

const Auth = () => {
  const { toggleDispatch, user, userDispatch } = useContext(Context);

  useEffect(() => {
    const token = localStorage.getItem('user');
    const userid = token
      ? JSON.parse(
          atob(
            localStorage
              .getItem('user')
              .split('.')[1]
              .replace('-', '+')
              .replace('_', '/')
          )
        ).id
      : undefined;
    if (userid)
      axios
        .get(`${API_URL}users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response =>
          userDispatch({
            type: 'LOG_IN',
            payload: response.data.filter(obj => obj.id === userid)
          })
        )
        .catch(error => {
          console.log('An error occurred:', error);
        });
  }, [userDispatch]);

  return !user[0] ? (
    <div
      className="auth authFalse"
      onClick={() => {
        toggleDispatch({
          type: 'toggleAuth'
        });
        window.scrollTo(0, 0);
      }}
    ></div>
  ) : (
    <>
      <div
        className={user ? 'auth' : 'auth authFalse'}
        onClick={() => {
          toggleDispatch({
            type: 'toggleAuth'
          });
          window.scrollTo(0, 0);
        }}
      ></div>
      <div className="username">Привет {user[0].username}</div>
    </>
  );
};

export default Auth;
