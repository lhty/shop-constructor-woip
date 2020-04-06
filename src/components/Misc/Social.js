import React, { useState, useEffect } from "react";

import "./Social.css";

const Social = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _vk = window.VK;
    (() => {
      _vk.Api.call(
        "groups.getMembers",
        {
          group_id: 7155386,
          fields: "photo_100",
          v: "5.73"
        },
        async ({ response }) => {
          try {
            const result = await response;
            setData(result.items);
            setLoading(false);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      );
    })();
  }, []);

  if (loading) return null;

  const users = data.map(user => (
    <div className="Social-user-wrapper" key={user.id}>
      <img
        className="Social-user-photo"
        src={user.photo_100}
        alt={user.first_name}
      />
      <p>{user.first_name + " " + user.last_name}</p>
    </div>
  ));

  return <div className="Social-container">{users}</div>;
};

export default Social;
