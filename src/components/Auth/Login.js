import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

import './Login.css';

const Login = () => {
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
        // Handle success.
        console.log('Well done!');
        // console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('user not found');
      });
  };

  return (
    <form className="auth-page-login" onSubmit={handleSubmit}>
      <h1 className="auth-page-login-title">Log-IN</h1>
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
  );
};

export default Login;
