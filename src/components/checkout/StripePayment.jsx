import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Paper
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
      padding: '16px',
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
        let errorMessage = "Payment failed. Please try again.";
        if (error.type === 'card_error' || error.code === 'card_declined') {
          errorMessage = error.message; // Use Stripe's detailed card error message
        } else {
          errorMessage = "Payment failed due to a system error. Please try again later.";
        }
        setError(errorMessage);
        onPaymentError(errorMessage);
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
        <Paper 
          elevation={0} 
          sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2.5,
            mb: 3,
            backgroundColor: 'rgba(138, 43, 226, 0.02)',
            '&:hover': {
              borderColor: '#8a2be2',
              boxShadow: '0 0 0 1px rgba(138, 43, 226, 0.2)',
            }
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Card Number, Expiry Date and CVC
          </Typography>
          
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Paper>
        
        <Button
          type="submit"
          variant="contained"
          disabled={processing || !stripe || succeeded}
          fullWidth
          sx={{
            backgroundColor: '#8a2be2',
            '&:hover': { backgroundColor: '#6a1fb1' },
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
          startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
        >
          {processing ? 'Processing...' : succeeded ? 'Payment Successful' : 'Pay Securely'}
        </Button>

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, textAlign: 'center', color: 'text.secondary' }}>
          Your payment information is secured with SSL encryption
        </Typography>
      </form>
    </Box>
  );
};

export default StripePayment;
