import React, { createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Firebase auth integration:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user.uid);
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
