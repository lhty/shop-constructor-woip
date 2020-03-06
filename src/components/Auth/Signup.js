import React, { useContext, useState } from "react";
import { useSpring, animated } from "react-spring";
import Spinner from "../Assets/Spinner";
import { UserContext } from "../Providers/UserProvider";

import "./Signup.css";

const Signup = () => {
  const { signUp, loading, error, clearError } = useContext(UserContext);
  const [inputValues, setInputValues] = useState({
    name: null,
    password: null,
    email: null,
    phone: null
  });
  const handleOnChange = event => {
    const { name, value } = event.target;
    clearError();
    setInputValues({ ...inputValues, [name]: value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    signUp(inputValues);
  };

  const inputStyle = useSpring({
    background: error ? "#ffcece75" : "#f4eae1"
  });

  return (
    <form className="auth-page-signup" onSubmit={handleSubmit}>
      <animated.input
        style={inputStyle}
        autoComplete="off"
        name="name"
        placeholder="Имя"
        onChange={handleOnChange}
        required
      ></animated.input>
      <animated.input
        style={inputStyle}
        autoComplete="off"
        name="password"
        placeholder="Пароль"
        onChange={handleOnChange}
        required
      ></animated.input>
      <animated.input
        style={inputStyle}
        name="email"
        placeholder="Почта"
        onChange={handleOnChange}
        required
      ></animated.input>
      <animated.input
        style={inputStyle}
        name="phone"
        placeholder="Номер телефона"
        onChange={handleOnChange}
      ></animated.input>
      <button
        type="submit"
        disabled={
          !inputValues.name ||
          !inputValues.password ||
          !inputValues.email ||
          !inputValues.phone
        }
      >
        {loading ? <Spinner /> : "Зарегистрироваться"}
      </button>
    </form>
  );
};

export default Signup;
