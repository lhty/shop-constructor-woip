import React, { useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Context } from '../Providers/Provider';

import './Signup.css';

const Signup = () => {
  const { userDispatch } = useContext(Context);
  const [inputValues, setInputValues] = useState();
  const handleOnChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`${API_URL}auth/local/register`, {
        username: inputValues.Name,
        email: inputValues.Phone,
        password: inputValues.Password
      })
      .then(response => {
        localStorage.setItem('user', response.data.jwt);
        userDispatch({
          type: 'LOG_IN',
          payload: response.data.user
        });
      })
      .catch(error => {});
  };

  return (
    <form className="auth-page-signup" onSubmit={handleSubmit}>
      <h1 className="auth-page-signup-title">Регистрация</h1>
      <input
        name="Name"
        placeholder="Как к вам обращатсья ?"
        onChange={handleOnChange}
        required
      ></input>
      <input
        name="Password"
        placeholder="Пароль"
        onChange={handleOnChange}
        required
      ></input>
      <input
        name="Phone"
        placeholder="Номер телефона"
        onChange={handleOnChange}
        required
      ></input>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Signup;
