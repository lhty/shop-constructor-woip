import React from "react";

import sortprice from "../../img/sort-byprice.svg";
import sortsize from "../../img/sort-bypsize.svg";
import "./ProductSort.css";

export default function ProductSort({ sortProps, dispatch }) {
  const checkStyle = (prop, [active, inactive, disabled]) => {
    switch (prop) {
      case true:
        return active;
      case false:
        return inactive;
      default:
        return disabled;
    }
  };

  return (
    <div className="Product-sort">
      <div className="sort-by">Ключевые слова</div>
      <div
        className="sort-by"
        onClick={() =>
          dispatch({
            sortProps: {
              ...sortProps,
              price: !sortProps.price
            }
          })
        }
      >
        по цене
        <img
          className={checkStyle(sortProps.price, [
            "inactive",
            "reversed",
            "hidden"
          ])}
          src={sortprice}
          alt=""
        />
      </div>
      <div
        className="sort-by"
        onClick={() => {
          dispatch({
            sortProps: {
              ...sortProps,
              size: !sortProps.size
            }
          });
        }}
      >
        по размеру
        <img
          className={checkStyle(sortProps.size, [
            "small",
            "inactive",
            "hidden"
          ])}
          src={sortsize}
          alt=""
        />
      </div>
    </div>
  );
}
