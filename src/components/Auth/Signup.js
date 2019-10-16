import React, { useContext, useState } from 'react';
import { Context } from '../Providers/Provider';

import './Signup.css';

const Signup = () => {
  const { Register } = useContext(Context);
  const [inputValues, setInputValues] = useState();
  const handleOnChange = event => {
    const { name, value = '' } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    Register(inputValues);
  };

  return (
    <form className="auth-page-signup" onSubmit={handleSubmit}>
      <h1 className="auth-page-signup-title">Регистрация</h1>
      <input
        name="name"
        placeholder="Как к вам обращатсья ?"
        onChange={handleOnChange}
        required
      ></input>
      <input
        name="password"
        placeholder="Пароль"
        onChange={handleOnChange}
        required
      ></input>
      <input
        name="email"
        placeholder="Почта"
        onChange={handleOnChange}
        required
      ></input>
      <input
        name="phone"
        placeholder="Номер телефона"
        onChange={handleOnChange}
      ></input>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Signup;
