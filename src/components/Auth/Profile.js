import React, { useContext } from 'react';
import { Context } from '../Providers/Provider';

import './Profile.css';

const Profile = () => {
  const { user, userDispatch, cartDispath } = useContext(Context);

  return !user[0] ? (
    <></>
  ) : (
    <div>
      Привет : {user[0].username}
      <button
        onClick={() => {
          userDispatch({ type: 'LOG_OUT' });
          cartDispath({ type: 'CART_CLEAR' });
          localStorage.clear();
        }}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Profile;
