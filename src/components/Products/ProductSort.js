import React, { useState, useEffect, useCallback, useReducer } from "react";

import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import sortprice from "../../img/sort-byprice.svg";
import sortsize from "../../img/sort-bypsize.svg";
import "./ProductSort.css";

export default function ProductSort({ sortProps, dispatch }) {
  const [tagIsOpen, toggle] = useState(false);

  const reducer = (state, tag) => {
    if (state.includes(tag)) return state.filter(val => val !== tag);
    return [...state, tag];
  };

  const [state, add] = useReducer(reducer, []);

  const updateTags = useCallback(() => {
    dispatch({
      sortProps: {
        tags: state
      }
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
          className={tagIsOpen ? "sort-by selected" : "sort-by inactive"}
          onClick={() => toggle(!tagIsOpen)}
        >
          Ключевые слова
        </div>
        <div
          className={checkStyle(sortProps.price, [
            "sort-by",
            "sort-by",
            "sort-by inactive"
          ])}
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
          className={checkStyle(sortProps.size, [
            "sort-by",
            "sort-by",
            "sort-by inactive"
          ])}
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
      {tagIsOpen && <Tags {...{ state, add }} />}
    </>
  );
}

const Tags = ({ state, add }) => {
  const { data, error, loading } = useQuery(gql`
    {
      tags {
        name
      }
    }
  `);

  if (loading || error) return null;

  const tags = data.tags.map(tag => (
    <p
      className={state.includes(tag.name) ? "selected" : ""}
      onClick={() => add(tag.name)}
      key={tag.name}
    >
      #{tag.name}
    </p>
  ));

  return <div className="sort-tags">{tags}</div>;
};
