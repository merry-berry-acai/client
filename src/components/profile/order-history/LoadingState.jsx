import React from 'react';
import { Box, Typography } from '@mui/material';

const LoadingState = () => (
  <Box sx={{ py: 4, textAlign: 'center' }}>
    <Typography variant="body1" color="text.secondary">Loading order history...</Typography>
  </Box>
);

export default LoadingState;
