import React, { useContext, useEffect } from 'react';
import { UserContext } from '../Providers/UserProvider';
import Userphoto from './Elements/Userphoto';

const Auth = ({ toggle }) => {
  const { user, RetrieveLogin, setActive, active } = useContext(UserContext);

  const token = localStorage.getItem('user');
  useEffect(() => {
    if (token) RetrieveLogin();
  }, [token, RetrieveLogin]);

  return (
    <span onClick={() => setActive({ ...active, auth: !active.auth })}>
      <Userphoto user={user ? user[0] : false} />
    </span>
  );
};

export default Auth;
