import React, { useReducer, useState } from "react";
import { ThumbnailUrl, ImgUrl } from "./ThumbnailUrls";
import { CartReducer } from "./Reducers/CartReducer";

export const Context = React.createContext();

const Provider = (props) => {
  const [cart, cartDispath] = useReducer(CartReducer, []);
  const [construct, setConstruct] = useState(false);

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
