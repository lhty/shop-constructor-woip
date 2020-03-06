import React, { useState, useEffect, useCallback } from "react";
import { useFetch } from "../Hooks/useFetch";
import { API_URL } from "../../config";

const StorageName = "user";
export const UserContext = React.createContext();

const UserProvider = props => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState(null);
  const [active, setActive] = useState({ auth: false, cart: false });

  const { loading, request, error, clearError } = useFetch();

  useEffect(() => {
    if (token && token !== localStorage.getItem(StorageName))
      localStorage.setItem(StorageName, token);
  }, [token]);

  const login = async ({ name, password }) => {
    try {
      let data = await request(`${API_URL}auth/local`, "POST", {
        identifier: name,
        password
      });

      setToken(data.jwt);
      setUser(data.user);
    } catch (e) {}
  };

  const signUp = async ({
    name,
    password,
    photo = "",
    email = null,
    phone = null
  }) => {
    try {
      let data = await request(`${API_URL}auth/local/register`, "POST", {
        username: name,
        password,
        email,
        phone,
        photo
      });

      setToken(data.jwt);
      setUser(data.user);
      login({ name, password });
    } catch (e) {}
  };

  const getUser = useCallback(
    async token => {
      try {
        let user = await request(`${API_URL}users/me`, "GET", null, {
          Authorization: `Bearer ${token}`
        });

        setUser(user);
      } catch (e) {}
    },
    [request]
  );

  const socialLogin = useCallback(
    async (provider, access_token) => {
      try {
        const response = await request(
          `${API_URL}auth${provider}callback?access_token=${access_token}`,
          "GET"
        );
        const { user, jwt } = await response.json();
        console.log(user);
        setToken(jwt);
      } catch (e) {}
    },
    [request]
  );

  useEffect(() => {
    const token = localStorage.getItem(StorageName);
    if (token) getUser(token);
  }, [getUser]);

  useEffect(() => {
    let social_access_token = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    let social_access_provider = window.location.pathname;

    if (social_access_token) {
      socialLogin(social_access_provider, social_access_token);
    }
  }, [socialLogin]);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        clearError,
        loading,
        setUser,
        login,
        signUp,
        active,
        setActive
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
