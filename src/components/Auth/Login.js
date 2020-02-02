import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Providers/UserProvider";
import { API_URL } from "../../config";

import "./Login.css";

const Login = () => {
  const { Login, Vklogin, setActive, active, userDispatch } = useContext(
    UserContext
  );
  const [inputValues, setInputValues] = useState({
    name: null,
    password: null
  });

  useEffect(() => {
    let access_token = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    let access_provider = window.location.pathname;

    if (access_token) {
      (async () => {
        const endpoint = `${API_URL}auth${access_provider}callback?access_token=${access_token}`;
        const res = await fetch(endpoint, {
          method: "GET"
        });
        res.json().then(({ jwt, user }) => {
          if (!localStorage.getItem("user")) {
            localStorage.setItem("user", jwt);
          }
          userDispatch({
            type: "LOG_IN",
            payload: user
          });
        });
      })();
    }
  }, [userDispatch]);

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
        <a
          className="auth-page-fb"
          href={`${API_URL}connect/facebook?callback=${window.location.href}`}
        >
          {null}
        </a>
      </div>
    </>
  );
};

export default Login;
