import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Cart from "../Cart/Cart";
import CartList from "../Cart/CartList";
import Userphoto from "../Auth/Elements/Userphoto";
import AuthPage from "../Auth/AuthPage";
import { UserContext } from "../../containers/UserProvider";

import title from "../../resources/img/title.svg";
import "./Header.css";

export default function Header({ match: { url } }) {
  const { user, loading, setActive, active } = useContext(UserContext);
  const AuthRef = useRef();
  const HeaderRef = useRef();
  const history = useHistory();

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  function handleClickOutside(e) {
    if (
      AuthRef.current &&
      !AuthRef.current.contains(e.target) &&
      HeaderRef.current &&
      !HeaderRef.current.contains(e.target)
    ) {
      setActive({
        ...active,
        auth: false,
      });
    }
  }

  return (
    <>
      <header ref={HeaderRef} className="header main-bg">
        <span
          onClick={() =>
            setActive({
              ...active,
              auth: !active.auth,
            })
          }
        >
          <Userphoto user={user} loading={loading} />
        </span>
        <img
          className="header-title"
          onClick={() => {
            window.pageYOffset === 0
              ? setActive({ auth: false, cart: false })
              : window.scrollTo(0, 0);
            history.replace("/");
          }}
          src={title}
          alt=""
          draggable="false"
        />
        <Cart />
      </header>
      {active.auth && (
        <div ref={AuthRef}>
          <AuthPage user={user} />
        </div>
      )}
      {active.cart && <CartList url={url} />}
    </>
  );
}
