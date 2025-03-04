import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true
};

const StripePayment = ({ clientSecret, orderId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setError(`Payment failed: ${error.message}`);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        
        // Send payment confirmation to backend
        const paymentData = {
          paymentIntent,
          orderId
        };

        onPaymentSuccess(paymentData);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      onPaymentError("Unexpected payment error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {succeeded && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment processed successfully!
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box 
          sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            p: 2,
            mb: 3
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          disabled={processing || !stripe || succeeded}
          fullWidth
          sx={{
            backgroundColor: '#8a2be2',
            '&:hover': { backgroundColor: '#6a1fb1' },
            py: 1.2,
            px: 3,
            minWidth: 180
          }}
          startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
        >
          {processing ? 'Processing...' : succeeded ? 'Payment Successful' : 'Pay Securely'}
        </Button>

        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Your payment information is secured with SSL encryption
        </Typography>
      </form>
    </Box>
  );
};

export default StripePayment;