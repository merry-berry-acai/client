import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ErrorState = ({ error, onRetry }) => (
  <Box sx={{ py: 4, textAlign: 'center' }}>
    <Typography variant="body1" color="error">{error}</Typography>
    <Button 
      variant="outlined" 
      sx={{ mt: 2, color: 'purple', borderColor: 'purple' }}
      onClick={onRetry}
    >
      Try Again
    </Button>
  </Box>
);

export default ErrorState;
