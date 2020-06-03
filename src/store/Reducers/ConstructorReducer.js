const ADD = "ADD";
const REMOVE_ITEM = "REMOVE_ITEM";
const EXPAND = "EXPAND";

export const ConstructorReducer = (state, action) => {
  switch (action.type) {
    case ADD:
      const text = action.input.split("").reverse();
      let quantity = action.quantity;
      action.quantity > 1
        ? state.product.set.map(
            (obj, i) =>
              !obj &&
              quantity !== 0 &&
              state.product.set.splice(i, 1, {
                ...action.payload,
                letter: text[quantity - 1],
              }) &&
              quantity--
          )
        : action.fromIndex
        ? state.product.set.splice(action.fromIndex, 1, {
            ...action.payload,
            letter: action.input || null,
          })
        : state.product.set.splice(state.product.set.indexOf(false), 1, {
            ...action.payload,
            letter: action.input || null,
          });
      return { ...state, current_page: action.current_page };
    case REMOVE_ITEM:
      return {
        ...state,
        product: {
          ...state.product,
          set: state.product.set.map((prod, i) =>
            i === action.index ? (prod = false) : prod
          ),
        },
      };
    case EXPAND:
      return {
        ...state,
        product: { ...state.product, set: [...state.product.set, false] },
      };
    default:
      return { ...state, ...action };
  }
};
