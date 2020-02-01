import React, { useContext, useState } from "react";

import { UserContext } from "../Providers/UserProvider";

import "./Login.css";

const Login = () => {
  async function FB() {
    const endpoint = "https://backend.sweetdreams.ru.com/connect/facebook";

    const res = await fetch(endpoint, {
      method: "GET",
      mode: "no-cors"
    }).catch(error => error);
    console.log(res);
  }

  const { Login, Vklogin, setActive, active } = useContext(UserContext);
  const [inputValues, setInputValues] = useState({
    name: null,
    password: null
  });

  const handleOnChange = event => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    Login(inputValues);
    setActive({ ...active, auth: !active.auth });
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
        <button
          type="submit"
          disabled={!inputValues.name || !inputValues.password}
        >
          Войти
        </button>
      </form>
      <div className="auth-social">
        <label
          className="auth-page-vk"
          onClick={() => {
            Vklogin();
            setActive({ ...active, auth: !active.auth });
          }}
        ></label>
        <label
          className="auth-page-fb"
          onClick={() => {
            FB();
          }}
        ></label>
      </div>
    </>
  );
};

export default Login;
