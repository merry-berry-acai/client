import React, { createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { storeUserPhoto, clearUserPhoto, getUserPhoto } from '../utils/localStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Firebase auth integration:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        storeUserPhoto(user.photoURL);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        clearUserPhoto();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
