import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';
import axios from 'axios';
import { API_URL } from '../../config';
import Userphoto from './Elements/Userphoto';

const Auth = () => {
  const { toggleDispatch, user, userDispatch } = useContext(Context);
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

  useEffect(() => {
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
  }, [userid, token, userDispatch]);

  return <Userphoto user={user[0]} toggleDispatch={toggleDispatch} />;
};

export default Auth;
