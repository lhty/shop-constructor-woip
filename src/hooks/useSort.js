import { useReducer, useEffect } from "react";
import { ascend, descend, prop, sort, intersection } from "ramda";
import { composeBundle } from "../store/Utils";

export const useSort = (input) => {
  const [output, dispatch] = useReducer(sortingReducer, {
    initial: [],
    filtered: [],
    sortProps: {},
  });

  useEffect(() => {
    if (input) {
      dispatch({
        initial:
          input[0].__typename === "product" ? composeBundle(input) : input,
      });
    }
  }, [input]);

  return { output, dispatch };
};

const sortingReducer = (state, action) => {
  const { initial, sortProps } = { ...state, ...action };

  const doFilter = (list, key, propsList) => {
    if (!propsList.length) return list;
    return list.filter((obj) =>
      Array.isArray(obj[key])
        ? intersection(
            obj[key].map((tag) => tag.name),
            propsList
          ).length
        : propsList.includes(obj[key])
    );
  };

  const doSort = (list, key, value) => {
    if (!key) return list;
    const direction = value ? ascend : descend;
    return sort(direction(prop(key)), list);
  };

  return {
    initial,
    filtered: Object.entries(sortProps).reduce(
      (sorted, [key, value]) =>
        Array.isArray(value)
          ? doFilter(sorted, key, value)
          : doSort(sorted, key, value),
      initial
    ),
    sortProps,
  };
};
