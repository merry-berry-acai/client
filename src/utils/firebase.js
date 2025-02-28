// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendUserToDB } from "../api/apiHandler";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Debug flag - set to true to enable verbose logging
const DEBUG = import.meta.env.VITE_NODE_ENV === 'development';

// Logger function to only log when debug is enabled
const log = (message, data) => {
  if (DEBUG) {
    if (data) {
      console.log(`🔥 Firebase: ${message}`, data);
    } else {
      console.log(`🔥 Firebase: ${message}`);
    }
  }
};

//Example of using onAuthStateChanged to monitor the authentication state:
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log("User signed in:", uid);
    // ...
  } else {
    // User is signed out
    console.log("User signed out");
    // ...
  }
});

const handleGoogleSignIn = async (navigate) => {
  log('Starting Google sign in process');
  try {
    log('Initiating Google popup');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    log('Google sign in successful for user:', user.uid);
    
    // Prepare user data for database
    const userForDB = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      favorites: [], // Default empty favorites for Google sign-in
      role: 'user' // Default role
    };
    
    log('User data prepared for database:', userForDB);
    
    try {
      // Send user data to database
      log('Sending user data to database via sendUserToDB');
      await sendUserToDB(userForDB);
      log('User data successfully sent to database');
    } catch (error) {
      console.error("❌ Error saving user data to database:", error);
      log('Database save failed, but continuing authentication');
      // Continue with authentication even if database save fails
    }
    
    toast.success("Login Successful!");
    log('Redirecting to profile page');
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return result;
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    log('Google sign in failed with error:', error.message);
    toast.error("Google Sign-In failed. Please try again.");
  }
};

// Sign-up
const signUp = async (email, password, navigate, displayName, userData = {}) => {
  log(`Starting email signup process for: ${email}`);
  log('Additional user data:', userData);
  
  try {
    // Create the user with email and password
    log('Creating user with email and password');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    log('User created successfully:', user.uid);
    
    // Update profile with displayName if provided
    if (displayName) {
      log(`Updating profile with displayName: ${displayName}`);
      await updateProfile(user, { displayName });
      log('Profile updated successfully');
    }
    
    // Prepare user data for database with any additional data provided
    const userForDB = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || 'User',
      photoURL: user.photoURL,
      favorites: userData.favorites || [],
      role: 'user' // Default role
    };
    
    log('User data prepared for database:', userForDB);
    
    try {
      // Send user data to database
      log('Calling sendUserToDB to save user data');
      await sendUserToDB(userForDB);
      log('User data successfully sent to database');
    } catch (dbError) {
      console.error("❌ Error saving user data to database:", dbError);
      log('Database save failed, but continuing with authentication');
      // Continue with authentication even if database save fails
    }
    
    toast.success("Sign Up Successful!");
    log('Redirecting to profile page');
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("❌ Sign-up error:", errorCode, errorMessage);
    log('Sign-up failed with error code:', errorCode);
    
    // Show appropriate error message
    if (errorCode === 'auth/email-already-in-use') {
      toast.error("Email already in use. Please use a different email or sign in.");
    } else {
      toast.error("Sign-up failed. Please try again.");
    }
    
    throw error; // Rethrow the error for the caller to handle
  }
};

// Sign-in
const signIn = async (email, password, navigate) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    toast.success("Sign In Successful!");
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
    
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Sign-in error:", errorCode, errorMessage);
    
    // Show appropriate error message
    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
      toast.error("Invalid email or password.");
    } else {
      toast.error("Sign-in failed. Please try again.");
    }
    
    throw error; // Rethrow the error for the caller to handle
  }
};

// Sign-out
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      toast.success("Sign Out Successful!");
      console.log("User signed out");
    })
    .catch((error) => {
      // An error happened.
      console.error("Sign-out error:", error);
    });
};

export {auth, signIn, signUp, signOutUser, handleGoogleSignIn};