import React, { useEffect, useState } from "react";
import { Overlay, GrowingCircles } from "reloa";
import { useLocation } from "react-router-dom";

import { AUTO_LOGIN, LOGIN } from "../services/api";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [wasLoggedWithAutoLogin, setWasLoggedWithAutoLogin] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(null);

  useEffect(() => {
    async function autoLogin() {
      const username = window.localStorage.getItem("username");

      if (!username) {
        setIsLogged(false);
        return false;
      }

      try {
        setIsLoading(true);

        const { url, options } = AUTO_LOGIN(username);
        const response = await fetch(url, options);
        const json = await response.json();

        if (!response.ok || !json.ok) throw new Error(json.message);

        setLoggedUser(username);
        setIsNewAccount(json.data);
        setIsLogged(true);
        setWasLoggedWithAutoLogin(true);
      } catch (error) {
        window.localStorage.removeItem("username");

        console.error("Falha no auto-login: " + error.message);

        setLoggedUser(null);
        setIsLogged(false);
      } finally {
        setIsLoading(false);
      }
    }

    autoLogin();
  }, []);

  function logout() {
    window.localStorage.removeItem("username");
    setWasLoggedWithAutoLogin(false);
    setIsLogged(false);
    setLoggedUser(null);
    setIsLoading(false);
    setError(null);
  }

  async function login(username, password) {
    try {
      setIsLoading(true);

      const body = {
        username,
        password,
      };

      const { url, options } = LOGIN(body);
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok || !json.ok) throw new Error(json.message);

      window.localStorage.setItem("username", username);

      setLoggedUser(username);
      setIsNewAccount(json.data);
      setIsLogged(true);
      setError(null);
    } catch (error) {
      setError(error);
      setIsLogged(false);

      console.error(error);

      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        isLoading,
        error,
        isLogged,
        loggedUser,
        logout,
        login,
        isNewAccount,
        wasLoggedWithAutoLogin,
      }}
    >
      <>
        <Overlay
          show={isLoading}
          style={{
            background: "#fff",
          }}
        >
          <GrowingCircles
            colorScale={[
              "rgba(var(--color-primary-dark), 1)",
              "rgba(var(--color-primary-light), 1)",
              "rgba(var(--color-primary-dark), 1)",
            ]}
          />
        </Overlay>

        {children}
      </>
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
