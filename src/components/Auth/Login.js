import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useInterval } from '../Providers/Hooks/useInterval';
import { API_URL } from '../../config';
import { Context } from '../Providers/Provider';

import './Login.css';

const VK = window.VK;

const Login = () => {
  const { userDispatch } = useContext(Context);
  const [badRequest, setBadRequest] = useState(false);
  const [inputValues, setInputValues] = useState();

  const handleOnChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`${API_URL}auth/local`, {
        identifier: inputValues.Name,
        password: inputValues.Password
      })
      .then(response => {
        localStorage.setItem('user', response.data.jwt);
        userDispatch({
          type: 'LOG_IN',
          payload: response.data.user
        });
      })
      .catch(error => {
        if (error) setBadRequest(true);
      });
  };

  useInterval(() => {
    if (badRequest) setBadRequest(false);
  }, 4000);

  const VkAuth = () => {
    VK.Auth.login(r => {
      if (r.session) {
        axios
          .post(`${API_URL}auth/local/register`, {
            username: r.session.user.first_name,
            email: r.session.user.id,
            password: r.session.user.domain + r.session.user.id
          })
          .then(response => {
            localStorage.setItem('user', response.data.jwt);
          })
          .catch(error => {
            if (error) {
              axios
                .post(`${API_URL}auth/local`, {
                  identifier: r.session.user.first_name,
                  password: r.session.user.domain + r.session.user.id
                })
                .then(response => {
                  localStorage.setItem('user', response.data.jwt);
                  userDispatch({
                    type: 'LOG_IN',
                    payload: response.data.user
                  });
                })
                .catch(error => {
                  if (error) setBadRequest(true);
                });
            }
          });
      }
    });
  };

  return (
    <>
      <label className="auth-page-vk" onClick={VkAuth}></label>
      <form className="auth-page-login" onSubmit={handleSubmit}>
        <h1 className="auth-page-login-title">Вход</h1>
        {badRequest && (
          <span className="auth-page-login-400">
            Неверное имя пользователя или пароль
          </span>
        )}
        <input
          name="Name"
          placeholder="Номер телефона / Имя"
          onChange={handleOnChange}
          required
        ></input>
        <input
          name="Password"
          placeholder="Пароль"
          onChange={handleOnChange}
          required
        ></input>
        <button type="submit">Войти</button>
      </form>
    </>
  );
};

export default Login;
