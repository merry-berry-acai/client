import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";

import { auth, googleProvider } from './config';
import { showSnackbar } from './notifications';
import { sendUserToDB } from '../api/services/userService';
import { authLogger as log } from '../utils/logger';

// Auth state monitoring
export const setupAuthStateListener = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uid = user.uid;
      log.info("User signed in:", uid);
    } else {
      // User is signed out
      log.info("User signed out");
    }
  });
};

// Google Sign-in
export const handleGoogleSignIn = async (navigate) => {
  log.info('Starting Google sign in process');
  try {
    log.info('Initiating Google popup');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    log.info('Google sign in successful for user:', user.uid);
    
    // Get user token
    const authToken = await user.getIdToken(true);
    log.debug('Auth token obtained for user');
    
    // Prepare user data for database
    const userForDB = {
      uid: user.uid, // Make sure to include uid
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      favorites: [],
      role: 'user'
    };
    
    log.debug('User data prepared for database:', userForDB);
    
    try {
      log.info('Sending user data to database via sendUserToDB');
      await sendUserToDB(userForDB, user.uid, authToken);
      log.info('User data successfully sent to database');
    } catch (error) {
      log.error("Error saving user data to database:", error);
      log.warn('Database save failed, but continuing authentication');
    }
    
    showSnackbar.success("Login Successful!");
    log.info('Redirecting to profile page');
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return result;
  } catch (error) {
    log.error("Google Sign-In Error:", error);
    log.error('Google sign in failed with error:', error.message);
    showSnackbar.error("Google Sign-In failed. Please try again.");
  }
};

// Email/Password Sign-up
export const signUp = async (email, password, navigate, displayName, userData = {}) => {
  log.info(`Starting email signup process for: ${email}`);
  log.debug('Additional user data:', userData);
  
  try {
    log.info('Creating user with email and password');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    log.info('User created successfully:', user.uid);
    
    // Get auth token
    const authToken = await user.getIdToken(true);
    log.debug('Auth token obtained for user');
    
    if (displayName) {
      log.info(`Updating profile with displayName: ${displayName}`);
      await updateProfile(user, { displayName });
      log.info('Profile updated successfully');
    }
    
    const userForDB = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || 'User',
      photoURL: user.photoURL,
      favorites: userData.favorites || [],
      role: 'user'
    };
    
    log.debug('User data prepared for database:', userForDB);
    
    try {
      log.info('Calling sendUserToDB to save user data');
      await sendUserToDB(userForDB, user.uid, authToken); // Fixed parameter passing
      log.info('User data successfully sent to database');
    } catch (dbError) {
      log.error("Error saving user data to database:", dbError);
      log.warn('Database save failed, but continuing with authentication');
    }
    
    showSnackbar.success("Sign Up Successful!");
    log.info('Redirecting to profile page');
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    log.error("Sign-up error:", errorCode, errorMessage);
    log.error('Sign-up failed with error code:', errorCode);
    
    if (errorCode === 'auth/email-already-in-use') {
      showSnackbar.error("Email already in use. Please use a different email or sign in.");
    } else {
      showSnackbar.error("Sign-up failed. Please try again.");
    }
    
    throw error;
  }
};

// Email/Password Sign-in
export const signIn = async (email, password, navigate) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    showSnackbar.success("Sign In Successful!");
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    log.error("Sign-in error:", errorCode, errorMessage);
    
    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
      showSnackbar.error("Invalid email or password.");
    } else {
      showSnackbar.error("Sign-in failed. Please try again.");
    }
    
    throw error;
  }
};

// Sign-out
export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      showSnackbar.success("Sign Out Successful!");
      log.info("User signed out");
    })
    .catch((error) => {
      log.error("Sign-out error:", error);
    });
};

// Get current user's token
export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken(true);
  } catch (error) {
    log.error("Error getting auth token:", error);
    return null;
  }
};
