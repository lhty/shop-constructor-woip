import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../store/UserProvider";
import { API_URL } from "../../config";
import Spinner from "../Assets/Spinner";

import "./Login.css";

const Login = () => {
  const { login, loading, error, clearError } = useContext(UserContext);
  const [inputValues, setInputValues] = useState({
    name: "",
    password: "",
  });

  const callbackUrl = window.location.href;

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(inputValues);
    setInputValues({
      ...inputValues,
      prev: { name: inputValues.name, password: inputValues.password },
    });
  };

  useEffect(() => {
    if (error)
      setTimeout(() => {
        clearError();
      }, 1000);
  }, [error, clearError]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          disabled={error}
          name="name"
          placeholder="Номер телефона / Имя"
          value={error ? "Неправильные данные" : inputValues.name}
          onChange={handleOnChange}
          required
        ></input>
        <input
          disabled={error}
          name="password"
          placeholder={error || "Пароль"}
          value={error ? "Неправильные данные" : inputValues.password}
          onChange={handleOnChange}
          required
        ></input>
        <button
          type="submit"
          disabled={
            !inputValues.name || !inputValues.password || loading || error
          }
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
