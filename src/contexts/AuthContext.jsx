import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { storeUserPhoto, clearUserPhoto, getUserPhoto } from '../utils/localStorage';
import { checkIsAdmin } from '../api/apiHandler';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setIsAuthenticated(true);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  // Firebase auth integration:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user?.uid);
      
      if (user) {
        storeUserPhoto(user.photoURL);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // Check if user is admin
        try {
          console.log("Starting admin status check for:", user.uid);
          const adminStatus = await checkIsAdmin(user.uid);
          console.log("Admin status check complete. Result:", adminStatus);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error in admin check:", error);
          setIsAdmin(false);
        }
      } else {
        clearUserPhoto();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
