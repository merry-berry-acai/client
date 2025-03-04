import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { makeRequest } from '../api/apiHandler';
import Layout from '../components/Layout';
import { 
  CheckoutStepReview, 
  CheckoutStepPayment, 
  CheckoutStepConfirmation 
} from '../components/checkout';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Add state for Stripe integration
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  
  // Add a ref to track if cart was cleared
  const cartCleared = useRef(false);
  
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
    // Check for return status from payment
    const paymentStatus = searchParams.get('payment_status');
    
    if (paymentStatus === 'success' && !cartCleared.current) {
      setActiveStep(2); // Move to confirmation step
      clearCart();      // Clear the cart on successful payment
      cartCleared.current = true; // Mark that we've cleared the cart
      setLoading(false);
      return;
    }
    
    if (paymentStatus === 'cancelled') {
      navigate('/cart');
      return;
    }
    
    // Reset the cartCleared ref if we're not in success state
    if (paymentStatus !== 'success') {
      cartCleared.current = false;
    }
    
    // Don't try to create a checkout session if cart is empty
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Just set loading to false as we start at review step
    setLoading(false);
    setActiveStep(0);
  }, [clearCart, navigate, searchParams, cartItems]);

  // Event handlers
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
   const handleSubmitOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Submit order to backend
      const orderResponse = await makeRequest({
        method: 'post',
        endpoint: '/orders/new',
        data: orderData
      });
      
      // Extract order ID
      const orderId = orderResponse?.order?._id;
      setOrderId(orderId);
  
      // Create payment intent
      const paymentIntentResponse = await makeRequest({
        method: 'post',
        endpoint: '/checkout/payment',
        data: {
          amount: Math.round(total * 100), // Convert to cents
          currency: 'AUD',
          orderId: orderId
        }
      });
      
      // Access clientSecret
      const clientSecret = paymentIntentResponse?.clientSecret;
      const paymentIntent = paymentIntentResponse?.paymentIntentId;

      if (paymentIntent) {
        setPaymentIntent(paymentIntent);
      } else {
        throw new Error("Missing payment intent from response");
      }
      
      if (clientSecret) {
        setClientSecret(clientSecret);
        setActiveStep(1);
      } else {
        throw new Error("Missing client secret from payment intent");
      }


      
    } catch (err) {
      console.error("Error processing order:", err);
      setError("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = (paymentData) => {
    // Success, navigate to confirmation
    console.log('Payment successful:', paymentData);
    cartCleared.current = true;
    
    // First set the active step to confirmation (step 2)
    setActiveStep(2);
    
    // Then record the payment
    makeRequest({
      method: 'post',
      endpoint: '/checkout/payment/store',
      data: {
        paymentIntent: paymentData.paymentIntent,
        orderId: paymentData.orderId
      }
    }).then(() => {
      console.log('Payment successfully recorded');
      // Update URL after recording payment
      navigate('/checkout?payment_status=success', { replace: true });
    }).catch(err => {
      console.error("Error recording payment:", err);
      // Still update URL even if recording fails
      navigate('/checkout?payment_status=success', { replace: true });
    });
  };
  
  const handlePaymentError = (errorMessage) => {
    setError(`Payment error: ${errorMessage}`);
    setLoading(false);
  };
  
  const handleSkipToSuccess = () => {
    cartCleared.current = true;
    navigate('/checkout?payment_status=success');
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  // Render the current checkout step
  const renderCheckoutStep = () => {
    if (loading && activeStep !== 1) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (activeStep) {
      case 0:
        return (
          <CheckoutStepReview
            cartItems={cartItems}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onBackToCart={handleBackToCart}
            onNextStep={(orderData) => handleSubmitOrder(orderData)}
            onSkipToSuccess={handleSkipToSuccess}
          />
        );
      case 1:
        return (
          <CheckoutStepPayment
            clientSecret={clientSecret}
            orderId={orderId}
            loading={loading}
            onBackStep={() => setActiveStep(0)}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onSkipToSuccess={handleSkipToSuccess}
          />
        );
      case 2:
        return (
          <CheckoutStepConfirmation
            onContinueShopping={handleContinueShopping}
            orderId={orderId}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

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
          {renderCheckoutStep()}
          
          {/* Add development notice banner at the bottom when not in confirmation step */}
          {activeStep !== 2 && (
            <Box 
              sx={{ 
                mt: 4, 
                p: 1.5, 
                bgcolor: 'info.main', 
                color: 'white',
                borderRadius: 1,
                opacity: 0.9
              }}
            >
              <Typography variant="body2" align="center">
                <strong>Development Mode:</strong> This is a mock checkout flow. Use the orange "DEV" buttons to skip steps.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
