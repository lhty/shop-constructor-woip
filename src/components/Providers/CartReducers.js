const CART_ADD = 'CART_ADD';
const CART_REMOVE = 'CART_REMOVE';

export const CartReducer = (cart, action) => {
  switch (action.type) {
    case CART_ADD:
      const founded = cart.find(obj => obj.id === action.payload.id)
        ? {
            ...action.payload,
            quantity:
              cart.find(obj => obj.id === action.payload.id).quantity + 1
          }
        : action.payload;

      return [...cart, founded].filter(
        (obj, index) =>
          index !== cart.findIndex(obj => obj.id === action.payload.id)
      );

    case CART_REMOVE:
      return cart.map(val =>
        val.id === action.id ? cart.filter(i => i !== val) : cart
      );
    default:
      return cart;
  }
};
