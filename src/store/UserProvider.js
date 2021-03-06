import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { API_URL } from "../config";
import { localStorageName } from "../config";

export const UserContext = React.createContext();

const UserProvider = ({ children, token, setToken }) => {
  const [user, setUser] = useState(false);
  const [active, setActive] = useState({ auth: false, cart: false });

  const { request, loading, error, clearError } = useFetch();

  const history = useHistory();

  const login = async ({ name, password }) => {
    const data = await request(`${API_URL}auth/local`, "POST", {
      identifier: name,
      password,
    });
    if (data) {
      setToken(data.jwt);
      setUser(data.user);
    }
  };

  const signUp = async ({
    name,
    password,
    photo = "",
    email = null,
    phone = null,
  }) => {
    const data = await request(`${API_URL}auth/local/register`, "POST", {
      username: name,
      password,
      email,
      phone,
      photo,
    });

    setToken(data.jwt);
    setUser(data.user);
    login({ name, password });
  };

  const getUser = useCallback(
    async (token) => {
      const user = await request(`${API_URL}users/me`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setUser(user);
    },
    [request]
  );

  const socialLogin = useCallback(
    async (provider, access_token) => {
      const { jwt } = await request(
        `${API_URL}auth${provider}callback${access_token}`,
        "GET"
      );
      setToken(jwt);
      getUser(jwt);
      history.replace("/");
    },
    [request, history, getUser, setToken]
  );

  useEffect(() => {
    if (token && token !== localStorage.getItem(localStorageName))
      localStorage.setItem(localStorageName, token);
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem(localStorageName);
    if (token) getUser(token);
  }, [getUser]);

  useEffect(() => {
    const providers = ["vk", "facebook"];

    let social_access_token = window.location.search;
    let social_access_provider = window.location.pathname;

    if (
      providers.includes(social_access_provider.replace(/\W/g, "")) &&
      social_access_token
    ) {
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
        setActive,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
