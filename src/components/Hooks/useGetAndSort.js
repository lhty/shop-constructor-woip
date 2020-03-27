import { useReducer, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { ascend, descend, prop, sort, intersection } from "ramda";

const sortingReducer = (state, action) => {
  let { initial, filtered, sortProps } = { ...state, ...action };
  const sortParams = sortProps && Object.keys(sortProps).slice(1);
  const tags = sortProps.tags.length;

  // if (!Array.isArray(initial) || !sortParams.length)
  //   return { initial, filtered: initial, sortProps };

  const tagFilter = initial.filter(
    product =>
      intersection(
        product.tags.map(tag => tag.name),
        sortProps.tags
      ).length > 0
  );

  const doSort = (arr, params) => {
    for (let param of params) {
      const direction = sortProps[param] ? ascend : descend;
      const sorted = sort(direction(prop(param)));
      const result = sorted(filtered);
      console.log(result);

      return result;
    }
  };

  // console.log(doSort(tagFilter, sortParams));

  return {
    initial,
    filtered: tags ? tagFilter : initial,
    sortProps
  };
};

const useGetAndSort = (query, param) => {
  const { data, error, loading } = useQuery(query, {
    variables: {
      id: param
    }
  });

  const [output, dispatch] = useReducer(sortingReducer, {
    initial: [],
    filtered: [],
    sortProps: { tags: [] }
  });

  useEffect(() => {
    if (!loading && !error) {
      dispatch({
        initial: composeBundle(data[Object.keys(data)[0]])
      });
    }
  }, [data, loading, error]);

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
  return products.length > 1
    ? products.map(product => ({ ...product, ...composeSet(product) }))
    : { ...products, ...composeSet(products) };
}

export default useGetAndSort;
