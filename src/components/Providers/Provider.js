import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { PRODUCTS_QUERY, PRODUCT_QUERY, PROMO_QUERY } from './Queries';
import { CartReducer } from './Reducers/CartReducers';
import { LoginReducer } from './Reducers/LoginReducer';
import { Toggler } from './Reducers/Toggler';

import axios from 'axios';
import { API_URL } from '../../config';

export const Context = React.createContext();

const Provider = props => {
  const [user, userDispatch] = useReducer(LoginReducer, false);
  const [cart, cartDispath] = useReducer(CartReducer, []);

  const [toggleWhat, toggleDispatch] = useReducer(Toggler, {
    toggleCart: false,
    toggleAuth: false
  });

  function Login({ name, password }) {
    axios
      .post(`${API_URL}auth/local`, {
        identifier: name,
        password: password
      })
      .then(response => {
        localStorage.setItem('user', response.data.jwt);
        userDispatch({
          type: 'LOG_IN',
          payload: response.data.user
        });
      })
      .catch(error => {
        if (error) {
          console.log('wrong name or password');
        }
      });
  }

  function Register({
    name,
    password,
    photo = false,
    email = null,
    phone = null
  }) {
    axios
      .post(`${API_URL}auth/local/register`, {
        username: name,
        password: password,
        email: email,
        phone: phone,
        photo: photo
      })
      .then(response => {
        localStorage.setItem('user', response.data.jwt);
        userDispatch({
          type: 'LOG_IN',
          payload: response.data.user
        });
      })
      .catch(error => {
        if (error) {
          console.log('email already taken');
        }
      });
  }

  function Vklogin() {
    window.VK.Auth.login(response => {
      if (response.status === 'connected') {
        let userdata = {
          name:
            response.session.user.first_name +
            ' ' +
            response.session.user.last_name,
          password: response.session.user.domain + response.session.user.id,
          email: 'id' + response.session.user.id
        };
        window.VK.Api.call(
          'users.get',
          { user_ids: response.session.user.id, fields: 'photo_50', v: '5.73' },
          response => {
            Register({
              ...userdata,
              photo: response.response[0].photo_50
            });
            Login(userdata);
          }
        );
      }
    }, 4194304);
  }

  return (
    <Context.Provider
      value={{
        PRODUCTS_QUERY,
        PRODUCT_QUERY,
        PROMO_QUERY,
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        toggleWhat,
        toggleDispatch,
        user,
        userDispatch,
        Register,
        Login,
        Vklogin
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
