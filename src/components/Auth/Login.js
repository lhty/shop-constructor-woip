import React, { useContext, useState } from 'react';

import { Context } from '../Providers/Provider';

import './Login.css';

const Login = () => {
  const { Login, Vklogin } = useContext(Context);
  const [inputValues, setInputValues] = useState();

  const handleOnChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    Login(inputValues);
  };

  return (
    <>
      <label className="auth-page-vk" onClick={() => Vklogin()}></label>
      <form className="auth-page-login" onSubmit={handleSubmit}>
        <h1 className="auth-page-login-title">Вход</h1>

        <input
          name="name"
          placeholder="Номер телефона / Имя"
          onChange={handleOnChange}
          required
        ></input>
        <input
          name="password"
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
