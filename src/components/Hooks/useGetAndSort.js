import { useReducer, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { ascend, descend, prop, sort } from "ramda";

const sortingReducer = (state, action) => {
  let { list, sortProps } = { ...state, ...action };

  if (!Array.isArray(list) || !sortProps) return { list };

  const sortRules = Object.keys(sortProps);

  sortRules.forEach(key => {
    const direction = sortProps[key] ? ascend : descend;
    const sorting = sort(direction(prop(key)));
    list = sorting(list);
  });

  return { list, sortProps };
};

const useGetAndSort = (query, param) => {
  const { data, error, loading } = useQuery(query, {
    variables: {
      id: param
    }
  });

  useEffect(() => {
    if (!loading && !error) {
      dispatch({
        list: composeBundle(data[Object.keys(data)[0]])
      });
    }
  }, [data, loading, error]);

  const [output, dispatch] = useReducer(sortingReducer, {
    list: [],
    sortProps: {}
  });

  return { output, loading, dispatch };
};

function composeSet({ items = [], schema = [], proportion: { price = 0 } }) {
  const set = [];
  for (let element of schema.split(",")) {
    let item = parseInt(element)
      ? items.find(item => item.id === element)
      : {
          ...items.find(item => item.name === "Буква"),
          letter: element
        };
    price += item.price;
    set.push(item);
  }
  return {
    set,
    price,
    size: set.length
  };
}
function composeBundle(products = []) {
  console.log("bump!");

  return products.length > 1
    ? products.map(product => ({ ...product, ...composeSet(product) }))
    : { ...products, ...composeSet(products) };
}

export default useGetAndSort;
