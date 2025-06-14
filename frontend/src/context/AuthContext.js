import React, {createContext, useState, useEffect} from "react";
import {useContext} from "react";
import {useCart} from "../context/CartContext";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const {clearCart} = useCart();
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem("token");
    const rawUser = sessionStorage.getItem("user");

    try {
      const user =
        rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
      return {token, user};
    } catch (_) {
      return {token: null, user: null};
    }
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const rawUser = sessionStorage.getItem("user");

    if (token && rawUser) {
      try {
        setAuth({token, user: JSON.parse(rawUser)});
      } catch {
        setAuth({token: null, user: null});
      }
    }
  }, []);

  const loginAuth = (token, user) => {
    if (!token || !user) return;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    setAuth({token, user});
  };

  const updateUser = (updatedUser) => {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setAuth((prev) => ({...prev, user: updatedUser}));
  };

  const logoutAuth = () => {
    const username = auth?.user?.username;
    if (username) {
      sessionStorage.removeItem(`cart_${username}`);
    }
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    clearCart();
    setAuth({token: null, user: null});
  };

  return (
    <AuthContext.Provider
      value={{auth, setAuth, loginAuth, logoutAuth, updateUser}}
    >
      {children}
    </AuthContext.Provider>
  );
};
