import React, { createContext, useState, useContext, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { setSnackbarFunctions } from '../utils/firebase'; // Import setSnackbarFunctions

// Create context
export const SnackbarContext = createContext();

// Custom hook to use the snackbar
export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    autoHideDuration: 3000,
    position: { vertical: 'bottom', horizontal: 'center' }
  });

  useEffect(() => {
    setSnackbarFunctions({ // Call setSnackbarFunctions on mount
      success: showSuccess,
      error: showError,
      info: showInfo,
      warning: showWarning
    });
  }, []);

  // Function to show a success message
  const showSuccess = (message, options = {}) => {
    setSnackbar({
      ...snackbar,
      open: true,
      message,
      severity: 'success',
      ...options
    });
  };

  // Function to show an error message
  const showError = (message, options = {}) => {
    setSnackbar({
      ...snackbar,
      open: true,
      message,
      severity: 'error',
      ...options
    });
  };

  // Function to show an info message
  const showInfo = (message, options = {}) => {
    setSnackbar({
      ...snackbar,
      open: true,
      message,
      severity: 'info',
      ...options
    });
  };

  // Function to show a warning message
  const showWarning = (message, options = {}) => {
    setSnackbar({
      ...snackbar,
      open: true,
      message,
      severity: 'warning',
      ...options
    });
  };

  // Function to close the snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <SnackbarContext.Provider 
      value={{ 
        showSuccess,
        showError, 
        showInfo,
        showWarning
      }}
    >
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={closeSnackbar}
        anchorOrigin={snackbar.position}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
