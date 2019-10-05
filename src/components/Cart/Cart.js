import React, { useContext, useEffect } from 'react';
import { Context } from '../Providers/Provider';

import './Cart.css';

const Cart = () => {
  const { cart, cartDispath, toggleDispatch } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('cart') !== null)
      cartDispath({
        type: 'CART_RETRIVE',
        payload: JSON.parse(localStorage.getItem('cart'))
      });
  }, [cartDispath]);

  return (
    <div
      className="cart"
      onClick={() => {
        if (cart.length > 0)
          toggleDispatch({
            type: 'toggleCart'
          });
        window.scrollTo(0, 0);
      }}
    >
      <Bucket cart={cart} />
    </div>
  );
};

export default Cart;

const Bucket = ({ cart }) => {
  return (
    <>
      <svg
        width="39"
        height="39"
        viewBox="0 0 39 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.875 30.7924C30.3834 30.7924 29.8967 30.8915 29.4428 31.0841C28.9888 31.2766 28.5767 31.5589 28.23 31.9145C27.8832 32.2702 27.6088 32.6922 27.4224 33.1565C27.236 33.6207 27.1413 34.118 27.1437 34.6197C27.1437 36.7342 28.8012 38.447 30.875 38.447C31.8696 38.447 32.8234 38.0437 33.5266 37.326C34.2299 36.6082 34.625 35.6347 34.625 34.6197C34.625 33.6046 34.2299 32.6311 33.5266 31.9134C32.8234 31.1956 31.8696 30.7924 30.875 30.7924ZM0.875 0.17395V4.00125H4.625L11.3675 18.5201L8.8325 23.2124C8.51947 23.7955 8.36068 24.4518 8.37177 25.1166C8.38287 25.7814 8.56346 26.4318 8.89577 27.0037C9.22808 27.5756 9.70063 28.0492 10.2669 28.378C10.8331 28.7068 11.4735 28.8794 12.125 28.8787H34.625V25.0514H12.9162C12.8351 25.051 12.7554 25.029 12.6851 24.9877C12.6147 24.9465 12.5561 24.8872 12.5149 24.8159C12.4737 24.7445 12.4513 24.6634 12.45 24.5806C12.4487 24.4978 12.4685 24.416 12.5075 24.3434L14.1894 21.2241H28.1581C28.8268 21.2239 29.4833 21.0413 30.0596 20.6951C30.6359 20.3488 31.111 19.8516 31.4356 19.255L38.1406 6.83728C38.2976 6.54606 38.3775 6.21814 38.3726 5.88581C38.3676 5.55347 38.278 5.22818 38.1124 4.94197C37.9468 4.65576 37.7111 4.41849 37.4283 4.25354C37.1456 4.08859 36.8257 4.00164 36.5 4.00125H8.7725L6.99687 0.17395H0.875ZM12.1231 30.7924C11.6315 30.7924 11.1448 30.8915 10.6909 31.0841C10.237 31.2766 9.82481 31.5589 9.47808 31.9145C9.13136 32.2702 8.85691 32.6922 8.6705 33.1565C8.48409 33.6207 8.3894 34.118 8.39187 34.6197C8.39187 36.7342 10.0512 38.447 12.1231 38.447C13.1177 38.447 14.0715 38.0437 14.7748 37.326C15.478 36.6082 15.8731 35.6347 15.8731 34.6197C15.8731 33.6046 15.478 32.6311 14.7748 31.9134C14.0715 31.1956 13.1177 30.7924 12.1231 30.7924Z"
          fill={`${cart.length === 0 ? '#DEDEDE' : '#E4BFA0'}`}
        />
      </svg>
      {cart.length === 0 ? null : (
        <div className="cart-counter">
          {cart.reduce((a, b) => a + (b.quantity || 0), 0) > 99
            ? 99
            : cart.reduce((a, b) => a + (b.quantity || 0), 0)}
        </div>
      )}
    </>
  );
};
