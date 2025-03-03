import React, { createContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { storeUserPhoto, clearUserPhoto, getUserPhoto, storeWithExpiry, getWithExpiry, removeItem } from '../utils/localStorage';
import { checkIsAdmin } from '../api/apiHandler';
import { AUTH_CONFIG } from "../config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth integration:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user?.uid);
      
      if (user) {
        storeUserPhoto(user.photoURL);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // Check if admin status is cached
        const cachedAdminStatus = getWithExpiry(AUTH_CONFIG.adminCacheKey);
        if (cachedAdminStatus !== null && cachedAdminStatus.uid === user.uid) {
          setIsAdmin(cachedAdminStatus.isAdmin);
          console.log("Using cached admin status:", cachedAdminStatus.isAdmin);
        } else {
          // Check admin status from API
          try {
            console.log("Starting admin status check for:", user.uid);
            const adminStatus = await checkIsAdmin(user.uid);
            console.log("Admin status check complete. Result:", adminStatus);
            setIsAdmin(adminStatus);
            
            // Cache the admin status
            storeWithExpiry(AUTH_CONFIG.adminCacheKey, { uid: user.uid, isAdmin: adminStatus }, AUTH_CONFIG.adminCacheExpiry);
          } catch (error) {
            console.error("Error in admin check:", error);
            setIsAdmin(false);
          }
        }
      } else {
        clearUserPhoto();
        removeItem(AUTH_CONFIG.adminCacheKey);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
