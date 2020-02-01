import { useState, useCallback, useEffect } from "react";

const storageName = "user";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, []);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  return { login, logout, token, userId, ready };
};
