import React, { useReducer } from 'react';
import { ThumbnailUrl, ImgUrl } from './ThumbnailUrls';
import { CartReducer } from './Reducers/CartReducers';

export const Context = React.createContext();

const Provider = props => {
  const [cart, cartDispath] = useReducer(CartReducer, []);

  function MakeSet(products) {
    function _set(product) {
      const newSet = [];
      product.setschema.forEach(schema => {
        for (let i = 0; i < schema.quantity; i++) {
          newSet.push(
            product.items.find(item => parseInt(item.id) === schema.itemid)
          );
        }
      });
      return {
        ...product,
        set: newSet,
        price:
          product.proportion.price +
          newSet.map(obj => obj.price).reduce((a, b) => a + b)
      };
    }
    return products.length > 1
      ? products.map(product => _set(product))
      : _set(products);
  }

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        MakeSet
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
