import React, { useReducer, useState } from "react";
import { ThumbnailUrl, ImgUrl } from "./ThumbnailUrls";
import { CartReducer } from "./Reducers/CartReducers";

export const Context = React.createContext();

const Provider = props => {
  const [cart, cartDispath] = useReducer(CartReducer, []);
  const [construct, setConstruct] = useState(false);
  const [sortstate, setSortstate] = useState({
    byprice: null,
    bysize: null,
    offset: 0,
    page: 0
  });

  function MakeBundle(products) {
    function Set(product) {
      const _set = [];
      const _schema = product && product.schema && product.schema.split(",");
      _schema &&
        _schema.forEach(id =>
          _set.push(
            typeof parseInt(id) && parseInt(id) > 0
              ? product.items.find(item => parseInt(item.id) === parseInt(id))
              : product.items.find(item => item.name === "Буква")
              ? {
                  ...product.items.find(item => item.name === "Буква"),
                  letter: id
                }
              : false
          )
        );
      return {
        ...product,
        set: _set,
        price:
          _set.length > 0
            ? _set
                .map(obj => obj.price)
                .reduce((a, b) => a + b, product.proportion.price || 0)
            : 0
      };
    }
    return products && products.length > 1
      ? products.map(product => Set(product))
      : Set(products);
  }

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        sortstate,
        setSortstate,
        ThumbnailUrl,
        ImgUrl,
        MakeBundle,
        construct,
        setConstruct
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
