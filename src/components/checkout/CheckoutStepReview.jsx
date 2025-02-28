import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid
} from '@mui/material';
import CartItem from '../cart/CartItem';
import CheckoutOrderSummary from './CheckoutOrderSummary';

const CheckoutStepReview = ({ 
  cartItems, 
  subtotal, 
  tax, 
  total, 
  onBackToCart, 
  onNextStep,
  onSkipToSuccess 
}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Typography variant="h6" gutterBottom>
          Review Your Order
        </Typography>
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
              onClick={onNextStep}
              sx={{
                backgroundColor: '#8a2be2',
                '&:hover': { backgroundColor: '#6a1fb1' }
              }}
            >
              Continue to Payment
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
              DEV: Skip to Success
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
