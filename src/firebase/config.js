import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { FIREBASE_CONFIG } from "../config";
import { firebaseLogger } from "../utils/logger";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export the logger for Firebase modules
export const log = (message, data) => {
  firebaseLogger.info(message, data);
};

// Log initialization
firebaseLogger.info("Firebase initialized");

export { app, auth, googleProvider };
