// Re-export all Firebase services from a single entry point

import { auth } from '../firebase/config';
import { setSnackbarFunctions } from '../firebase/notifications';
import { 
  signIn, 
  signUp, 
  signOutUser, 
  handleGoogleSignIn,
  getCurrentUserToken,
  setupAuthStateListener
} from '../firebase/auth';

// Initialize auth state listener
setupAuthStateListener();

// Export everything
export { 
  auth, 
  signIn, 
  signUp, 
  signOutUser, 
  handleGoogleSignIn,
  getCurrentUserToken,
  setSnackbarFunctions
};