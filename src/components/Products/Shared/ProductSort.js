import React, { useEffect, useCallback, useReducer } from "react";

import { useTransition, animated } from "react-spring";

import sortprice from "../../../resources/img/sort-byprice.svg";
import sortsize from "../../../resources/img/sort-bypsize.svg";
import "./ProductSort.css";

export default function ProductSort({
  sortProps,
  dispatch,
  controls,
  options = ["price", "size"],
}) {
  const complex_options = options.filter((prop) => Array.isArray(prop));

  const [IsOpen, toggle] = useReducer(
    (IsOpen, toggle) => ({ ...IsOpen, ...toggle }),
    {
      ...complex_options.reduce((acc, key) => {
        acc[key[1]] = false;
        return acc;
      }, {}),
    }
  );

  const [optionList, addOption] = useReducer(
    (optionList, { key, value }) => {
      return {
        ...optionList,
        [key]: optionList[key].includes(value)
          ? optionList[key].filter((val) => val !== value)
          : [...optionList[key], value],
      };
    },
    complex_options.reduce((acc, key) => {
      acc[key[1]] = [];
      return acc;
    }, {})
  );

  const updateOptions = useCallback(() => {
    dispatch({
      sortProps: { ...optionList },
    });
  }, [dispatch, optionList]);

  useEffect(() => {
    updateOptions();
  }, [updateOptions]);

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
      {complex_options.map((option, i) => (
        <div
          key={i}
          className={
            IsOpen[option[1]] || optionList[option[1]].length
              ? "sort-by selected"
              : "sort-by inactive"
          }
          onClick={() => toggle({ [option[1]]: !IsOpen[option[1]] })}
        >
          {option[0]}
        </div>
      ))}
      {options.includes("price") && (
        <div
          className={checkStyle(sortProps.price, [
            "sort-by",
            "sort-by",
            "sort-by inactive",
          ])}
          onClick={() =>
            dispatch({
              sortProps: {
                ...sortProps,
                price: !sortProps.price,
              },
            })
          }
        >
          по цене
          <img
            className={checkStyle(sortProps.price, [
              "inactive",
              "reversed",
              "hidden",
            ])}
            src={sortprice}
            alt=""
          />
        </div>
      )}
      {options.includes("size") && (
        <div
          className={checkStyle(sortProps.size, [
            "sort-by",
            "sort-by",
            "sort-by inactive",
          ])}
          onClick={() => {
            dispatch({
              sortProps: {
                ...sortProps,
                size: !sortProps.size,
              },
            });
          }}
        >
          по размеру
          <img
            className={checkStyle(sortProps.size, [
              "small",
              "inactive",
              "hidden",
            ])}
            src={sortsize}
            alt=""
          />
        </div>
      )}
      {complex_options.map((option, i) => (
        <PropsList
          key={i}
          {...{
            IsOpen: IsOpen[option[1]],
            propKey: option[1],
            selected: optionList[option[1]],
            list:
              option[1] === "tags"
                ? option[2]?.map((prop) => prop.name)
                : option[2]?.map((prop) => prop[option[1]]),
            addOption,
          }}
        />
      ))}
    </div>
  );
}

const PropsList = ({ IsOpen, propKey, addOption, list, selected }) => {
  const transitions = useTransition(IsOpen, null, {
    from: { opacity: 0, y: -100 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 100 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} className="sort-tags">
          {list &&
            list.map((value, i) => (
              <p
                className={selected.includes(value) ? "selected" : ""}
                onClick={() => addOption({ key: propKey, value })}
                key={i}
              >
                {value}
              </p>
            ))}
        </animated.div>
      )
  );
};
