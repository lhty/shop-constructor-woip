import React, { useState, useReducer } from "react";
import { LoginReducer } from "./Reducers/LoginReducer";
import axios from "axios";
import { API_URL } from "../../config";

export const UserContext = React.createContext();

const UserProvider = props => {
  const [user, userDispatch] = useReducer(LoginReducer, { online: false });
  const [active, setActive] = useState({ auth: false, cart: false });

  function Login({ name, password }) {
    axios
      .post(`${API_URL}auth/local`, {
        identifier: name,
        password: password
      })
      .then(response => {
        localStorage.setItem("user", response.data.jwt);
        userDispatch({
          type: "LOG_IN",
          payload: response.data.user
        });
      })
      .catch(error => {
        if (error) {
          console.log("wrong name or password");
        }
      });
  }

  function Register({
    name,
    password,
    photo = "",
    email = null,
    phone = null
  }) {
    axios
      .post(`${API_URL}auth/local/register`, {
        username: name,
        password: password,
        email: email,
        phone: phone,
        photo: photo
      })
      .then(response => {
        localStorage.setItem("user", response.data.jwt);
        userDispatch({
          type: "LOG_IN",
          payload: response.data.user
        });
      })
      .catch(error => {
        if (error) {
        }
      });
  }

  function Vklogin() {
    window.VK.Auth.login(response => {
      if (response.status === "connected") {
        let userdata = {
          name:
            response.session.user.first_name +
            " " +
            response.session.user.last_name,
          password: response.session.user.domain + response.session.user.id,
          email: response.session.user.id + "@id.vk"
        };
        window.VK.Api.call(
          "users.get",
          { user_ids: response.session.user.id, fields: "photo_50", v: "5.73" },
          response => {
            axios
              .post(`${API_URL}auth/local`, {
                identifier: userdata.name,
                password: userdata.password
              })
              .then(response => {
                userDispatch({
                  type: "LOG_IN",
                  payload: response.data.user
                });
                if (!localStorage.getItem("user"))
                  localStorage.setItem("user", response.data.jwt);
              })
              .catch(error => {
                error.response.status === 400
                  ? Register({
                      ...userdata,
                      photo: response.response[0].photo_50
                    })
                  : console.log("Mainenance");
              });
          }
        );
      }
    }, 4194304);
  }

  function RetrieveLogin(token) {
    let uid = token
      ? JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace("-", "+")
              .replace("_", "/")
          )
        ).id
      : null;
    uid &&
      axios
        .get(`${API_URL}users?id=${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response =>
          userDispatch({
            type: "LOG_IN",
            payload: response.data[0]
          })
        )
        .catch(error => {
          console.log("An error occurred:", error);
        });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userDispatch,
        Register,
        Login,
        Vklogin,
        RetrieveLogin,
        active,
        setActive
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
