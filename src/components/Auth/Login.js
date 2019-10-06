import React, { useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Context } from '../Providers/Provider';

import './Login.css';

const Login = () => {
  const { userDispatch } = useContext(Context);

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
        userDispatch({ type: 'temp' });
      })
      .catch(error => {});
  };

  return (
    <>
      <form className="auth-page-login" onSubmit={handleSubmit}>
        <h1 className="auth-page-login-title">Вход</h1>
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
