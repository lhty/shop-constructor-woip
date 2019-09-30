import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { PRODUCTS_QUERY, PRODUCT_QUERY, PROMO_QUERY } from './Queries';
import { CartReducer } from './CartReducers';

export const Context = React.createContext();

const Provider = props => {
  const [cart, cartDispath] = useReducer(CartReducer, []);

  return (
    <Context.Provider
      value={{
        PRODUCTS_QUERY,
        PRODUCT_QUERY,
        PROMO_QUERY,
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
