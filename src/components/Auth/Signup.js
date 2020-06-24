import React, { useContext, useState, useEffect } from "react";
import Spinner from "../Assets/Spinner";
import { UserContext } from "../../store/UserProvider";

import "./Signup.css";

const Signup = () => {
  const { signUp, loading, error, clearError } = useContext(UserContext);
  const [inputValues, setInputValues] = useState({
    name: null,
    password: null,
    email: null,
    phone: null,
  });
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    clearError();
    setInputValues({ ...inputValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(inputValues);
  };

  useEffect(() => {
    if (error)
      setTimeout(() => {
        clearError();
      }, 500);
  }, [error, clearError]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={error}
        autoComplete="off"
        name="name"
        type="text"
        placeholder="Имя"
        onChange={handleOnChange}
        required
      ></input>
      <input
        disabled={error}
        autoComplete="off"
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleOnChange}
        required
      ></input>
      <input
        disabled={error}
        pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$"
        name="email"
        type="email"
        placeholder="Почта"
        onChange={handleOnChange}
        required
      ></input>
      <input
        disabled={error}
        name="phone"
        type="tel"
        placeholder="Номер телефона"
        onChange={handleOnChange}
        required
      ></input>
      <button
        type="submit"
        disabled={
          !inputValues.name ||
          !inputValues.password ||
          !inputValues.email ||
          !inputValues.phone ||
          error
        }
      >
        {loading ? <Spinner /> : "Зарегистрироваться"}
      </button>
    </form>
  );
};

export default Signup;
