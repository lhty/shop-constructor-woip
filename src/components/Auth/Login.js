import React, { useContext, useState } from 'react';

import { UserContext } from '../Providers/UserProvider';

import './Login.css';

const Login = () => {
  const { Login, Vklogin, setActive, active } = useContext(UserContext);
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
      <form className="auth-page-login" onSubmit={handleSubmit}>
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
      <label
        className="auth-page-vk"
        onClick={() => {
          Vklogin();
          setActive({ ...active, auth: !active.auth });
        }}
      ></label>
    </>
  );
};

export default Login;
