const CART_ADD = "CART_ADD";
const CART_REMOVE = "CART_REMOVE";
const CART_RETRIVE = "CART_RETRIVE";
const CART_CLEAR = "CART_CLEAR";

export const CartReducer = (cart, action) => {
  switch (action.type) {
    case CART_ADD:
      const FindDuplicate = cart.find(obj => obj.id === action.payload.id);
      return [
        ...cart,
        FindDuplicate
          ? {
              ...action.payload,
              quantity: FindDuplicate.quantity + 1
            }
          : action.payload
      ].filter(
        (obj, index) =>
          index !== cart.findIndex(obj => obj.id === action.payload.id)
      );
    case CART_REMOVE:
      return cart
        .map(obj =>
          obj.id === action.id ? { ...obj, quantity: obj.quantity - 1 } : obj
        )
        .filter(obj => obj.quantity > 0);
    case CART_CLEAR:
      return [];
    case CART_RETRIVE:
      return JSON.parse(localStorage.getItem("cart"));
    default:
      return cart;
  }
};
