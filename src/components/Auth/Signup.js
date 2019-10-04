import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

import './Signup.css';

const Signup = () => {
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
        // // Handle success.
        // console.log('Well done!');
        // console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
      });
  };

  return (
    <form className="auth-page-signup" onSubmit={handleSubmit}>
      <h1 className="auth-page-signup-title">Sign-UP</h1>
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
      <button type="submit">Зарегетрироваться</button>
    </form>
  );
};

export default Signup;
