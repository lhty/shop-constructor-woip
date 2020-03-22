import React, { useReducer, useState, useCallback } from "react";
import { ThumbnailUrl, ImgUrl } from "./ThumbnailUrls";
import { CartReducer } from "./Reducers/CartReducer";

export const Context = React.createContext();

const Provider = props => {
  const [cart, cartDispath] = useReducer(CartReducer, []);
  const [construct, setConstruct] = useState(false);

  const MakeBundle = useCallback(products => {
    const combineSet = product => {
      const _set = [];
      const _schema = product && product.schema && product.schema.split(",");
      let _totalPrice = product.proportion.price;
      _schema &&
        _schema.forEach(id => {
          let item =
            typeof parseInt(id) && parseInt(id) > 0
              ? product.items.find(item => parseInt(item.id) === parseInt(id))
              : product.items.find(item => item.name === "Буква")
              ? {
                  ...product.items.find(item => item.name === "Буква"),
                  letter: id
                }
              : false;
          _totalPrice += item.price;
          _set.push(item);
        });
      console.log("mixer called");
      return {
        ...product,
        set: _set,
        price: _totalPrice
      };
    };
    return products && products.length > 1
      ? products.map(product => combineSet(product))
      : combineSet(products);
  }, []);

  const composeSet = ({
    items = [],
    schema = [],
    proportion: { price = 0 }
  }) => {
    const set = [];
    for (let element of schema.split(",")) {
      let item = parseInt(element)
        ? items.find(item => parseInt(item.id) === parseInt(element))
        : {
            ...items.find(item => item.name === "Буква"),
            letter: element
          };
      price += item.price;
      set.push(item);
    }
    console.log("mixer called");
    return {
      set,
      price
    };
  };

  const composeBundle = (products = []) =>
    products.map(product => ({ ...product, ...composeSet(product) }));

  return (
    <Context.Provider
      value={{
        cart,
        cartDispath,
        ThumbnailUrl,
        ImgUrl,
        MakeBundle,
        composeBundle,
        construct,
        setConstruct
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default Provider;
