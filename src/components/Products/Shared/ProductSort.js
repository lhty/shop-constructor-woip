import React, { useEffect, useCallback, useReducer } from "react";

import { useTransition, animated } from "react-spring";

import "./ProductSort.css";

const settings = {
  price: { name: "Цена" },
  size: { name: "Размер" },
};

export default function ProductSort({
  sortProps,
  dispatch,
  products,
  filtered,
  options = ["price", "size"],
}) {
  const arrayLikeOptions = options.filter((prop) => Array.isArray(prop));

  const [IsOpen, toggle] = useReducer(
    (IsOpen, toggle) => ({ ...IsOpen, ...toggle }),
    {
      ...arrayLikeOptions.reduce((acc, key) => {
        acc[key[1]] = false;
        return acc;
      }, {}),
    }
  );

  const [optionList, addOption] = useReducer(
    (optionList, { key, value }) => {
      if (!value) return { ...optionList, [key]: [] };
      return {
        ...optionList,
        [key]: optionList[key].includes(value)
          ? optionList[key].filter((val) => val !== !value)
          : [...optionList[key], value],
      };
    },
    arrayLikeOptions.reduce((acc, key) => {
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

  const getPropList = (key, list) =>
    key === "tags"
      ? list.reduce(
          (list, prod) =>
            prod[key].length
              ? [...list, prod[key].map((prop) => prop.name)]
              : list,
          []
        )
      : list?.map((prod) => prod[key]);
  return (
    <div className="Product-sort">
      {arrayLikeOptions.map((option, i) => (
        <button
          key={i}
          disabled={!getPropList(option[1], products).length}
          className={
            IsOpen[option[1]] || optionList[option[1]].length
              ? "sort-by selected"
              : "sort-by inactive"
          }
          onClick={() =>
            toggle(
              Object.entries(IsOpen).reduce(
                (res, prop) => ({
                  ...res,
                  [prop[0]]: prop[0] === option[1] ? !prop[1] : false,
                }),
                {}
              )
            )
          }
        >
          <p>{option[0]}</p>
          {optionList[option[1]].length > 0 && (
            <div className="selected-info">
              <p className="counter">{optionList[option[1]].length}</p>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  addOption({ key: option[1] });
                }}
              >
                +
              </div>
            </div>
          )}
        </button>
      ))}
      {options
        .filter((prop) => !Array.isArray(prop))
        .map((option, i) => (
          <div
            key={i}
            className={checkStyle(sortProps[option], [
              "sort-by",
              "sort-by",
              "sort-by inactive",
            ])}
            onClick={() =>
              dispatch({
                sortProps: {
                  ...sortProps,
                  [option]: !sortProps[option],
                },
              })
            }
          >
            {settings[option].name}
          </div>
        ))}
      {arrayLikeOptions.map((option, i) => (
        <PropsList
          key={i}
          {...{
            IsOpen: IsOpen[option[1]],
            propKey: option[1],
            selected: optionList[option[1]],
            list: getPropList(option[1], products),
            availableList:
              Object.entries(optionList).filter(
                (prop) => prop[0] !== option[1] && prop[1].length
              ).length && getPropList(option[1], filtered),
            addOption,
          }}
        />
      ))}
    </div>
  );
}

const PropsList = ({
  IsOpen,
  propKey,
  addOption,
  list,
  availableList,
  selected,
}) => {
  const transitions = useTransition(IsOpen, null, {
    from: { opacity: 0, y: 0 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 100 },
  });

  if (!list) return null;
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} className="sort-tags">
          {[
            ...new Set(
              list
                .map((str) => (typeof str === "string" ? str.split(",") : str))
                .flat()
            ),
          ].map((value, i) => (
            <button
              disabled={
                availableList &&
                !availableList.some((str) => str?.includes(value))
              }
              className={selected.includes(value) ? "selected" : "unchecked"}
              onClick={() => addOption({ key: propKey, value })}
              key={i}
            >
              {value}
            </button>
          ))}
        </animated.div>
      )
  );
};
