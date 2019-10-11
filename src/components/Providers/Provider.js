import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { PRODUCTS_QUERY, PRODUCT_QUERY, PROMO_QUERY } from './Queries';
import { CartReducer } from './Reducers/CartReducers';
import { LoginReducer } from './Reducers/LoginReducer';
import { Toggler } from './Reducers/Toggler';

export const Context = React.createContext();

const Provider = props => {
  const [user, userDispatch] = useReducer(LoginReducer, false);
  const [cart, cartDispath] = useReducer(CartReducer, []);

  const [toggleWhat, toggleDispatch] = useReducer(Toggler, {
    toggleCart: false,
    toggleAuth: false
  });

  return (
    <Context.Provider
      value={{
        PRODUCTS_QUERY,
        PRODUCT_QUERY,
        PROMO_QUERY,
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        toggleWhat,
        toggleDispatch,
        user,
        userDispatch
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
