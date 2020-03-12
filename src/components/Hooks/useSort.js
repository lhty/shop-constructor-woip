import { useReducer, useEffect } from "react";
import { ascend, descend, prop, sort } from "ramda";

const sortingReducer = (prevList, newList) => {
  const { list, isAscending, key } = { ...prevList, ...newList };
  const direction = isAscending ? ascend : descend;
  const sorting = sort(direction(prop(key)));

  return { list: sorting(list), isAscending, key };
  //TBD
};

const useSort = (list, isAscending = true, key) => {
  const [output, dispatch] = useReducer(sortingReducer, {
    list,
    isAscending,
    key
  });

  //init
  // useEffect(() => {
  //   dispatch({});
  // }, []);

  return [output, dispatch];
};

export default useSort;
