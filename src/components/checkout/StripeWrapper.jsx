import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from './StripePayment';
import { CircularProgress, Box, Typography } from '@mui/material';

// You should move this to your environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_key_here");

const StripeWrapper = ({ clientSecret, orderId, onPaymentSuccess, onPaymentError }) => {
  if (!clientSecret) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Preparing payment gateway...
        </Typography>
      </Box>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePayment 
        clientSecret={clientSecret}
        orderId={orderId}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default StripeWrapper;
