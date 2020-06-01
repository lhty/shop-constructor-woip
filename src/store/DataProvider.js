import React, { useReducer } from "react";
import { ThumbnailUrl, ImgUrl } from "./Utils";
import { CartReducer } from "./Reducers/CartReducer";
import { ConstructorReducer } from "./Reducers/ConstructorReducer";

export const Context = React.createContext();

const Provider = (props) => {
  const [cart, cartDispath] = useReducer(CartReducer, []);

  const [state, setState] = useReducer(ConstructorReducer, {
    current_page: -1,
    product: null,
    details: null,
  });

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        state,
        setState,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
