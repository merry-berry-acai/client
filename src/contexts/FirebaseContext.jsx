import React, { createContext, useContext, useEffect } from 'react';
import { useSnackbar } from './SnackbarContext';
import { setSnackbarFunctions } from '../utils/firebase';

export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const snackbar = useSnackbar();

  // Connect the snackbar functions to firebase on mount
  useEffect(() => {
    setSnackbarFunctions({
      success: snackbar.showSuccess,
      error: snackbar.showError,
      info: snackbar.showInfo
    });
  }, [snackbar]);

  return (
    <FirebaseContext.Provider value={{}}>
      {children}
    </FirebaseContext.Provider>
  );
};
