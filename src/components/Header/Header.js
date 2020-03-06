import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import CartList from "../Cart/CartList";
import Userphoto from "../Auth/Elements/Userphoto";
import AuthPage from "../Auth/AuthPage";
import { UserContext } from "../Providers/UserProvider";

import title from "../../img/title.svg";
import "./Header.css";

export default function Header({ match: { url } }) {
  const { user, setActive, active } = useContext(UserContext);
  const AuthRef = useRef();
  const HeaderRef = useRef();

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
        auth: false
      });
    }
  }

  return (
    <>
      <header ref={HeaderRef} className="header">
        <div className="header-nav">
          <span
            onClick={() =>
              setActive({
                ...active,
                auth: !active.auth
              })
            }
          >
            <Userphoto user={user} />
          </span>
          <Link to="/">
            <img
              className="header-title"
              onClick={() => {
                window.pageYOffset === 0
                  ? setActive({ auth: false, cart: false })
                  : window.scrollTo(0, 0);
              }}
              src={title}
              alt=""
              draggable="false"
            />
          </Link>
          <Cart />
        </div>
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
