import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { PRODUCTS_QUERY, PRODUCT_QUERY, PROMO_QUERY } from './Queries';
import { CartReducer } from './Reducers/CartReducers';
import { Toggler } from './Reducers/Toggler';

export const Context = React.createContext();

const UserReducer = (user, action) => {
  switch (action.type) {
    case 'temp':
      return (user = true);
    case 'LOG_OUT':
      return (user = false);
    case 'LOG_IN':
      return action.payload;
    default:
      return user;
  }
};

const Provider = props => {
  const [user, userDispatch] = useReducer(UserReducer, false);

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
