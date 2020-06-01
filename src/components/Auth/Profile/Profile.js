import React, { useContext } from "react";
import { UserContext } from "../../../store/UserProvider";

import "./Profile.css";

const Profile = (user) => {
  const { setUser } = useContext(UserContext);

  return (
    <div className="profile-wrapper">
      {user.online && user.role.id > 2 && <button>Админка</button>}
      <button
        onClick={() => {
          localStorage.clear();
          setUser(false);
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;
