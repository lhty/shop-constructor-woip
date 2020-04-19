import { useReducer, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { ascend, descend, prop, sort, intersection } from "ramda";

const sortingReducer = (state, action) => {
  const {
    initial,
    sortProps: { tags, ...params },
  } = { ...state, ...action };

  const doFilter = (list, selectedTags) => {
    if (!selectedTags.length) return initial;
    const getProdTags = (prod) => prod.tags.map((tag) => tag.name);
    return list.filter(
      (product) => intersection(getProdTags(product), selectedTags).length > 0
    );
  };

  const doSort = (list, key, value) => {
    if (!key) return list;
    const direction = value ? ascend : descend;
    return sort(direction(prop(key)), list);
  };

  return {
    initial,
    filtered: Object.entries(params).reduce(
      (sorted, [key, value]) => (sorted = doSort(sorted, key, value)),
      doFilter(initial, tags)
    ),
    sortProps: { tags, ...params },
  };
};

const useProducts = (query, param) => {
  const { data, error, loading } = useQuery(query, {
    variables: {
      id: param,
    },
  });

  const [output, dispatch] = useReducer(sortingReducer, {
    initial: [],
    filtered: [],
    sortProps: { tags: [] },
  });

  useEffect(() => {
    if (!loading && !error) {
      dispatch({
        initial: data.items
          ? data[Object.keys(data)[0]]
          : composeBundle(data[Object.keys(data)[0]]),
      });
    }
  }, [data, loading, error]);

  return { output, loading, dispatch };
};

function composeSet({ items = [], schema = [], proportion: { price = 0 } }) {
  const set = [];
  for (let element of schema.split(",")) {
    let item = parseInt(element)
      ? items.find((item) => item.id === element)
      : {
          ...items.find((item) => item.name === "Буква"),
          letter: element,
        };
    price += item.price;
    set.push(item);
  }
  return {
    set,
    price,
    size: set.length,
  };
}
function composeBundle(products = []) {
  return products.length > 1
    ? products.map((product) => ({ ...product, ...composeSet(product) }))
    : { ...products, ...composeSet(products) };
}

export default useProducts;
