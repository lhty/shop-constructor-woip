import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';
import axios from 'axios';
import { API_URL } from '../../config';

import './Profile.css';

const Profile = () => {
  const { user, userDispatch, cartDispath } = useContext(Context);

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

  //   if (user[0] === undefined) return <div>Loading...</div>;
  return !user[0] ? (
    <div>Loading...</div>
  ) : (
    <div>
      Привет : {user[0].username}
      <button
        onClick={() => {
          userDispatch({ type: 'LOG_OUT' });
          cartDispath({ type: 'CART_CLEAR' });
          localStorage.clear();
        }}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Profile;
