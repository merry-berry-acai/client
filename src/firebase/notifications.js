// Global variable to store the snackbar function
// This avoids needing to pass the hook through the entire application
let showSnackbar = {
  success: (msg) => console.log('Toast success:', msg),
  error: (msg) => console.error('Toast error:', msg),
  info: (msg) => console.info('Toast info:', msg)
};

// Function to set snackbar functions from the context
export const setSnackbarFunctions = (snackbarFns) => {
  showSnackbar = snackbarFns;
};

export { showSnackbar };
