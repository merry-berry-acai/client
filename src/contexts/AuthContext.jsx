import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      if (username === "admin" && password === "password") {
        setIsAuthenticated(true);
        setUserRole("admin");
        resolve();
      } else {
        setIsAuthenticated(false);
        setUserRole("");
        reject();
      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
