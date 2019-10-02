import React, { useState } from 'react';

import './SignIn.css';

const SignIn = () => {
  // const [user, setUser] = useState();

  // const handleSubmitUser = () => {};

  return (
    <form className="auth-page-signin">
      <h1 className="auth-page-signin-title">Sign-IN</h1>
      <input name="Name" placeholder="Как к вам обращатсья ?"></input>
      <input name="Phone" placeholder="Номер телефона"></input>
      <button type="submit">Зарегетрироваться</button>
    </form>
  );
};

export default SignIn;
