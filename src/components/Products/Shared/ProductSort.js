import React, { useEffect, useCallback, useReducer } from "react";

import { useTransition, animated } from "react-spring";

import sortprice from "../../../resources/img/sort-byprice.svg";
import sortsize from "../../../resources/img/sort-bypsize.svg";
import "./ProductSort.css";

const settings = {
  price: { name: "Цена", img: sortprice },
  size: { name: "Размер", img: sortsize },
};

export default function ProductSort({
  sortProps,
  dispatch,
  options = ["price", "size"],
}) {
  const numericOptions = options.filter((prop) => !Array.isArray(prop));
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
          ? optionList[key].filter((val) => val !== value)
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

  return (
    <div className="Product-sort">
      {arrayLikeOptions.map((option, i) => (
        <div
          key={i}
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
            <>
              <p className="counter">{optionList[option[1]].length}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addOption({ key: option[1] });
                }}
              >
                +
              </button>
            </>
          )}
        </div>
      ))}
      {numericOptions.map((option, i) => (
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
          <img
            className={checkStyle(sortProps[option], [
              "inactive",
              "reversed",
              "hidden",
            ])}
            src={settings[option].img}
            alt=""
          />
        </div>
      ))}
      {arrayLikeOptions.map((option, i) => (
        <PropsList
          key={i}
          {...{
            IsOpen: IsOpen[option[1]],
            propKey: option[1],
            selected: optionList[option[1]],
            list:
              option[1] === "tags"
                ? option[2]?.map((prop) => prop.name)
                : option[2]?.filter(Boolean).map((prop) => prop[option[1]]),
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
        <animated.div key={key} style={props} className="sort-tags main-bg">
          {list &&
            [
              ...new Set(
                list
                  .map((str) =>
                    typeof str === "string" ? str.split(",") : str
                  )
                  .flat()
              ),
            ].map((value, i) => (
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
