import React, { useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Cart from "../Cart/Cart";
import CartList from "../Cart/CartList";
import Userpic from "../Auth/Elements/Userpic";
import AuthPage from "../Auth/AuthPage";
import { UserContext } from "../../store/UserProvider";

// import title from "../../resources/img/title.svg";
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

  const handleClickOutside = (e) => {
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
  };

  const handleAuthToggle = () =>
    setActive({
      ...active,
      auth: !active.auth,
    });

  return (
    <>
      <header ref={HeaderRef} className="header center w90 main-bg">
        <Userpic {...{ user, loading, handleAuthToggle }} />
        <h1
          style={{
            fontSize: "3rem",
            lineHeight: "3rem",
            fontWeight: "200",
            letterSpacing: "-0.11em",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            window.pageYOffset === 0
              ? setActive({ auth: false, cart: false })
              : window.scrollTo(0, 0);
            history.replace("/");
          }}
        >
          SweetDreams
        </h1>
        {/* <img
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
        /> */}
        <Cart />
      </header>
      {active.auth && (
        <div className="auth-page-container" ref={AuthRef}>
          <AuthPage user={user} />
        </div>
      )}
      {active.cart && <CartList url={url} />}
    </>
  );
}
