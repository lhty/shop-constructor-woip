import { useState } from "react";
import { localStorageName } from "../config";

export const useToken = () => {
  const [token, setToken] = useState(localStorage.getItem(localStorageName));

  return [token, setToken];
};
