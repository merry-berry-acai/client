import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const CheckoutStepConfirmation = ({ onContinueShopping }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h5" sx={{ color: 'success.main', mb: 2 }}>
        Payment Successful!
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for your order. Your payment has been processed successfully.
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        A confirmation email has been sent with your order details.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onContinueShopping}
        sx={{
          mt: 2,
          backgroundColor: '#8a2be2',
          '&:hover': { backgroundColor: '#6a1fb1' }
        }}
      >
        Continue Shopping
      </Button>
    </Box>
  );
};

export default CheckoutStepConfirmation;
