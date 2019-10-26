import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { CartReducer } from './Reducers/CartReducers';

export const Context = React.createContext();

const Provider = props => {
  const [cart, cartDispath] = useReducer(CartReducer, []);

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
