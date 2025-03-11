import React from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StripeWrapper from './StripeWrapper';
import EducatorNote from '../../components/EducatorNote';

const CheckoutStepPayment = ({
  clientSecret,
  orderId,
  loading,
  onBackStep,
  onPaymentSuccess,
  onPaymentError,
  onSkipToSuccess,
  cartItems = [], // Add cart items prop with default empty array
  subtotal = 0,   // Add subtotal prop with default 0
  tax = 0,        // Add tax prop with default 0
  shipping = 0,   // Add shipping prop with default 0
  total = 0       // Add total prop with default 0
}) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Payment Form Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LockIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">
                Secure Payment
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                mb: 3,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                bgcolor: 'rgba(138, 43, 226, 0.03)',
                borderRadius: 2
              }}
            >
              <Chip 
                icon={<CreditCardIcon />} 
                label="Visa" 
                variant="outlined" 
                sx={{ borderColor: '#1a1f71', color: '#1a1f71' }}
              />
              <Chip 
                icon={<CreditCardIcon />} 
                label="MasterCard" 
                variant="outlined" 
                sx={{ borderColor: '#eb001b', color: '#eb001b' }}
              />
              <Chip 
                icon={<CreditCardIcon />} 
                label="Amex" 
                variant="outlined" 
                sx={{ borderColor: '#006fcf', color: '#006fcf' }}
              />
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                <SecurityIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                Secured by Stripe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                <PaymentIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'text-bottom' }} />
                Card Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter your payment details below to complete your purchase securely.
              </Typography>
            </Box>
            
            {/* Stripe Payment Component */}
            <StripeWrapper
              clientSecret={clientSecret}
              orderId={orderId}
              onPaymentSuccess={onPaymentSuccess}
              onPaymentError={onPaymentError}
            />
          </Paper>
        </Grid>
        
        {/* Order Summary Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ShoppingBagIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Order Summary
              </Typography>
            </Box>
            
            <List sx={{ mb: 2 }}>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 1, px: 0 }}>
                      <ListItemText 
                        primary={item.name}
                        secondary={`Qty: ${item.quantity || 1}`}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        ${((item.basePrice || 0) * (item.quantity || 1)).toFixed(2)}
                      </Typography>
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No items in cart
                </Typography>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ my: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body1" color="text.secondary">Tax</Typography>
                <Typography variant="body1">${tax.toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, bgcolor: 'primary.light', p: 1.5, borderRadius: 1 }}>
              <Typography variant="body2" color="primary.contrastText">
                Your order will be processed after successful payment.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={onBackStep}
          sx={{ 
            borderColor: '#8a2be2',
            color: '#8a2be2',
            '&:hover': {
              borderColor: '#6a1fb1',
              backgroundColor: 'rgba(138, 43, 226, 0.08)'
            },
            py: 1.2
          }}
          startIcon={<span>←</span>}
        >
          Back to Review
        </Button>
        
        {/* Development/Testing Fallback Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={onSkipToSuccess}
          sx={{
            borderColor: '#ff9800',
            color: '#ff9800',
            '&:hover': {
              borderColor: '#f57c00',
              backgroundColor: 'rgba(255, 152, 0, 0.08)'
            }
          }}
        >
          DEV: Skip to Confirmation
        </Button>
      </Box>

      {/* Add educator note */}
      <EducatorNote sx={{ mt: 3 }}>
        <Typography variant="body2">
          This is a simulated payment interface for learning purposes. If you want to test the Stripe integration,
          use the test card number <strong>4242 4242 4242 4242</strong>, any future expiry date, and any 3-digit CVC.
          Alternatively, use the "Skip to Confirmation" button to bypass payment processing.
        </Typography>
      </EducatorNote>
    </Box>
  );
};

export default CheckoutStepPayment;
