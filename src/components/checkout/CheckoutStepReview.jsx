import React, { useContext, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import CartItem from '../cart/CartItem';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import { AuthContext } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import OrderDataBuilder from './OrderDataBuilder';

const CheckoutStepReview = ({
  cartItems,
  subtotal,
  tax,
  total,
  onBackToCart,
  onNextStep,
  onSkipToSuccess
}) => {
  const { currentUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleContinue = () => {
    if (!currentUser) {
      setError("You must be logged in to place an order");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const orderDataBuilder = new OrderDataBuilder();
    const orderData = orderDataBuilder
      .setTotalPrice(total)
      .addCartItems(cartItems)
      .build();

    // Send the order data up to the parent component
    onNextStep(orderData);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Typography variant="h6" gutterBottom>
          Review Your Order
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          {cartItems.map((item, index) => (
            <CartItem
              key={item._id || index}
              item={item}
              variant="checkout"
            />
          ))}
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={onBackToCart}
            sx={{
              borderColor: '#8a2be2',
              color: '#8a2be2',
              '&:hover': {
                borderColor: '#6a1fb1',
                backgroundColor: 'rgba(138, 43, 226, 0.08)'
              }
            }}
          >
            Back to Cart
          </Button>
          <Box>
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#8a2be2',
                '&:hover': { backgroundColor: '#6a1fb1' }
              }}
            >
              {isSubmitting ? (
                <React.Fragment>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Processing...
                </React.Fragment>
              ) : (
                "Continue to Payment"
              )}
            </Button>

            {/* Development Fallback Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={onSkipToSuccess}
              sx={{
                ml: 1,
                borderColor: '#ff9800',
                color: '#ff9800',
                '&:hover': {
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.08)'
                }
              }}
            >
              DEV: Skip to Payment
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={5}>
        <CheckoutOrderSummary
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </Grid>
    </Grid>
  );
};

export default CheckoutStepReview;
