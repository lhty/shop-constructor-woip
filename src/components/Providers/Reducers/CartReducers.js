const CART_ADD = 'CART_ADD';
const CART_REMOVE = 'CART_REMOVE';

export const CartReducer = (cart, action) => {
  switch (action.type) {
    case CART_ADD:
      const FindDuplicate = cart.find(obj => obj.id === action.id);
      return [
        ...cart,
        FindDuplicate
          ? {
              ...action,
              quantity: FindDuplicate.quantity + 1
            }
          : action
      ].filter(
        (obj, index) => index !== cart.findIndex(obj => obj.id === action.id)
      );

    case CART_REMOVE:
      return cart
        .map(obj =>
          obj.id === action.id ? { ...obj, quantity: obj.quantity - 1 } : obj
        )
        .filter(obj => obj.quantity > 0);
    default:
      return cart;
  }
};
