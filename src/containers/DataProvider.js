import React, { useReducer, useEffect } from "react";
import { ThumbnailUrl, ImgUrl } from "./ThumbnailUrls";
import { CartReducer } from "./Reducers/CartReducer";

export const Context = React.createContext();

const Provider = (props) => {
  const [cart, cartDispath] = useReducer(CartReducer, []);
  const [construct, setConstruct] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { product: null, details: null }
  );

  useEffect(() => {
    setConstruct({ product: null, details: null });
  }, []);

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        construct,
        setConstruct,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
