import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { createCheckoutSession } from '../api/apiHandler';
import Layout from '../components/Layout';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = ['Review order', 'Payment', 'Confirmation'];
  
  // Calculate order summary
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      // Calculate topping price
      const toppingTotal = Array.isArray(item.customization)
        ? item.customization.reduce((sum, topping) => sum + (topping.price || 0), 0)
        : 0;
      return total + ((item.basePrice + toppingTotal) * (item.quantity || 1));
    }, 0);
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  useEffect(() => {
    // Check for return status from Stripe
    const paymentStatus = searchParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      setActiveStep(2); // Move to confirmation step
      clearCart();      // Clear the cart on successful payment
      setLoading(false);
      return;
    }
    
    if (paymentStatus === 'cancelled') {
      navigate('/cart');
      return;
    }
    
    // Don't try to create a checkout session if cart is empty
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    const initCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Format items for the checkout session
        const checkoutItems = cartItems.map(item => ({
          id: item._id,
          name: item.name,
          price: item.basePrice,
          quantity: item.quantity || 1,
          customization: item.customization || [],
          imageUrl: item.imageUrl
        }));
        
        // Create checkout session
        const checkoutData = {
          items: checkoutItems,
          successUrl: `${window.location.origin}/checkout?payment_status=success`,
          cancelUrl: `${window.location.origin}/checkout?payment_status=cancelled`
        };
        
        const response = await createCheckoutSession(checkoutData);
        setClientSecret(response.clientSecret);
        setActiveStep(1); // Move to payment step
      } catch (err) {
        console.error("Error creating checkout session:", err);
        setError("We couldn't initialize the payment process. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    initCheckout();
  }, [cartItems, clearCart, navigate, searchParams]);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  // Render the confirmation step
  const renderConfirmation = () => (
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
        onClick={() => navigate('/menu')}
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

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            borderRadius: 2,
            border: '1px solid #eee'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : activeStep === 0 ? (
            // Step 1: Order Review
            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>
                  Review Your Order
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {cartItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 2, py: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={3} sm={2}>
                          <Box 
                            component="img" 
                            src={item.imageUrl || '/placeholder-image.jpg'} 
                            alt={item.name}
                            sx={{ 
                              width: '100%', 
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography variant="body1">${item.basePrice.toFixed(2)}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity || 1}
                          </Typography>
                          {item.customization && item.customization.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              {item.customization.map(c => c.name).join(', ')}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      {index < cartItems.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleBackToCart}
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
                  <Button 
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    sx={{
                      backgroundColor: '#8a2be2',
                      '&:hover': { backgroundColor: '#6a1fb1' }
                    }}
                  >
                    Continue to Payment
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    border: '1px solid #eee',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                    <Typography variant="body1">Tax (10%)</Typography>
                    <Typography variant="body1">${tax.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${total.toFixed(2)}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : activeStep === 1 ? (
            // Step 2: Payment
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              {clientSecret && (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </Box>
          ) : (
            // Step 3: Confirmation
            renderConfirmation()
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
