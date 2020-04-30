import React, { useState, useEffect, useCallback, useReducer } from "react";

import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import { useTransition, animated } from "react-spring";

import sortprice from "../../../resources/img/sort-byprice.svg";
import sortsize from "../../../resources/img/sort-bypsize.svg";
import "./ProductSort.css";

export default function ProductSort({ sortProps, dispatch, controls }) {
  const [IsOpen, toggle] = useState(false);

  const [state, add] = useReducer((state, tag) => {
    if (state.includes(tag)) return state.filter((val) => val !== tag);
    return [...state, tag];
  }, []);

  const updateTags = useCallback(() => {
    dispatch({
      sortProps: {
        tags: state,
      },
    });
  }, [dispatch, state]);

  useEffect(() => {
    updateTags();
  }, [updateTags]);

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
    <>
      <div className="Product-sort">
        <div
          className={
            IsOpen || state.length ? "sort-by selected" : "sort-by inactive"
          }
          onClick={() => toggle(!IsOpen)}
        >
          Ключевые слова
        </div>
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
        <Tags {...{ IsOpen, state, add, controls }} />
      </div>
    </>
  );
}

const Tags = ({ IsOpen, state, add, controls }) => {
  const { data, error, loading } = useQuery(gql`
    {
      tags {
        name
      }
    }
  `);

  const transitions = useTransition(IsOpen, null, {
    from: { opacity: 0, y: -100 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 100 },
  });

  if (loading || error) return null;

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} className="sort-tags">
          {data &&
            data.tags.map((tag) => (
              <p
                className={state.includes(tag.name) ? "selected" : ""}
                onClick={() => {
                  controls.changePage(0);
                  add(tag.name);
                }}
                key={tag.name}
              >
                #{tag.name}
              </p>
            ))}
        </animated.div>
      )
  );
};
