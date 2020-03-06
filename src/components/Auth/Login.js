import React, { useContext, useState } from "react";
import { UserContext } from "../Providers/UserProvider";
import { useSpring, animated } from "react-spring";
import { API_URL } from "../../config";
import Spinner from "../Assets/Spinner";

import "./Login.css";

const Login = () => {
  const { login, loading, error, clearError } = useContext(UserContext);
  const [inputValues, setInputValues] = useState({
    name: null,
    password: null
  });

  const callbackUrl = window.location.href;

  const inputStyle = useSpring({
    background: error ? "#ffcece75" : "#f4eae1"
  });

  const handleOnChange = event => {
    const { name, value } = event.target;
    clearError();
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    login(inputValues);
  };

  return (
    <>
      <form
        autoComplete="off"
        className="auth-page-login"
        onSubmit={handleSubmit}
      >
        <animated.input
          style={inputStyle}
          name="name"
          placeholder="Номер телефона / Имя"
          onChange={handleOnChange}
          required
        ></animated.input>
        <animated.input
          style={inputStyle}
          name="password"
          placeholder="Пароль"
          onChange={handleOnChange}
          required
        ></animated.input>
        <button
          type="submit"
          disabled={!inputValues.name || !inputValues.password || loading}
        >
          {loading ? <Spinner /> : "Войти"}
        </button>
      </form>

      <div className="auth-social">
        <a
          className="auth-page-vk"
          href={`${API_URL}connect/vk?callback=${callbackUrl}`}
        >
          {null}
        </a>
        <a
          className="auth-page-fb"
          href={`${API_URL}connect/facebook?callback=${callbackUrl}`}
        >
          {null}
        </a>
      </div>
    </>
  );
};

export default Login;
