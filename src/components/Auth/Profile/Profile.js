import React, { useContext } from 'react';
import { UserContext } from '../../Providers/UserProvider';
import { Context } from '../../Providers/Provider';

import './Profile.css';

const Profile = ({ logout }) => {
  const { user, userDispatch, setActive, active } = useContext(UserContext);
  const { cartDispath } = useContext(Context);

  return user[0] ? (
    <div className="profile-wrapper">
      {user[0] && user[0].role.id > 2 && <button>Админка</button>}
      <button
        onClick={() => {
          localStorage.clear();
          setTimeout(() => userDispatch({ type: 'LOG_OUT' }), 100);
          cartDispath({ type: 'CART_CLEAR' });
          setActive({ ...active, auth: !active.auth });
        }}
      >
        Выйти
      </button>
    </div>
  ) : (
    <></>
  );
};

export default Profile;
