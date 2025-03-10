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
import EducatorNote from '../components/EducatorNote';
import {
  CheckoutStepReview,
  CheckoutStepPayment,
  CheckoutStepConfirmation
} from '../components/checkout';
import ServiceFactory from '../api/services/ServiceFactory'; // Import ServiceFactory

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { currentUser, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Add state for Stripe integration
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentIntent, setPaymentIntent] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Track if cart is cleared
  const cartCleared = useRef(false);

  const steps = ['Review order', 'Payment', 'Confirmation'];
  const checkoutService = ServiceFactory.getService('checkout'); // Get CheckoutService

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
    // Don't try to create a checkout session if cart is empty and we're not in confirmation step
    if ((!cartItems || cartItems.length === 0) && !paymentCompleted && activeStep !== 2) {
      navigate('/cart');
      return;
    }

    // Just set loading to false as we start at review step
    setLoading(false);
  }, [cartItems, navigate, paymentCompleted, activeStep]);

  // Event handlers
  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleSubmitOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      // Submit order to backend using CheckoutService, passing authToken
      const orderResponse = await checkoutService.createOrder(orderData, authToken);

      console.log("orderResponse:", orderResponse);

      // Extract order ID
      const orderId = orderResponse?._id;
      setOrderId(orderId);

      // Create payment intent using CheckoutService, passing authToken
      const paymentIntentResponse = await checkoutService.createPaymentIntent({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'AUD',
        orderId: orderId
      }, authToken);

      console.log("paymentIntentResponse:", paymentIntentResponse);
      console.log("paymentIntentResponse?.data:", paymentIntentResponse?.data);

      // Access clientSecret
      const clientSecret = paymentIntentResponse?.clientSecret;

      if (clientSecret) {
        setClientSecret(clientSecret);
        setActiveStep(1);
      } else {
        throw new Error("Missing client secret from payment intent response");
      }
    } catch (err) {
      console.error("Error processing order:", err);
      Sentry.captureException(err, {
        extra: {
          action: "handleSubmitOrder"
        }
      });
      setError("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log('Payment successful:', paymentData);

      // Set payment as completed
      setPaymentCompleted(true);

      // Move to confirmation step
      setActiveStep(2);

      // Clear the cart if not already cleared
      if (!cartCleared.current) {
        clearCart();
        cartCleared.current = true;
      }

      // Record the payment using CheckoutService, passing authToken
      await checkoutService.storePaymentConfirmation(paymentData, authToken);

      console.log('Payment successfully recorded');
    } catch (err) {
      console.error("Error recording payment:", err);
      Sentry.captureException(err, {
        extra: {
          action: "handlePaymentSuccess"
        }
      });
      // Even if recording fails, we still want to show success to the user
      // as the payment was processed successfully
    }
  };
  
  const handlePaymentError = (errorMessage) => {
    setError(`Payment error: ${errorMessage}`);
    setLoading(false);
  };
  
  const handleSkipToSuccess = () => {
    // For development only - skip to the next step without API calls
    if (activeStep === 0) {
      // From Review to Payment
      setActiveStep(1);
    } else if (activeStep === 1) {
      // From Payment to Confirmation
      setPaymentCompleted(true);
      
      // Clear the cart if not already cleared
      if (!cartCleared.current) {
        clearCart();
        cartCleared.current = true;
      }
      
      setActiveStep(2);
    }
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
            cartItems={cartItems}
            subtotal={subtotal}
            tax={tax}
            shipping={0} // You may want to calculate this or pass a real value
            total={total}
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
          
          {/* Add educator note banner at the bottom when not in confirmation step */}
          {activeStep !== 2 && (
            <EducatorNote sx={{ mt: 4 }}>
              <Typography variant="body2">
                This is a simulated checkout experience for educational purposes. The orange buttons labeled "DEV" 
                allow you to navigate between checkout steps without processing actual transactions.
              </Typography>
            </EducatorNote>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default CheckoutPage;
