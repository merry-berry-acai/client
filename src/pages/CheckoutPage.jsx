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
import { createCheckoutSession, processPayment } from '../api/apiHandler';
import Layout from '../components/Layout';
import { 
  CheckoutStepReview, 
  CheckoutStepPayment, 
  CheckoutStepConfirmation 
} from '../components/checkout';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Add a ref to track if cart was cleared
  const cartCleared = useRef(false);
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({});
  
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
        setSessionId(response.sessionId);
        setActiveStep(0); // Start at review step
      } catch (err) {
        console.error("Error creating checkout session:", err);
        setError("We couldn't initialize the checkout process. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    initCheckout();
  }, [clearCart, navigate, searchParams, cartItems]);

  // Event handlers
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Updated validation function for new form fields
  const validateForm = () => {
    const errors = {};
    
    // Card information validation
    if (!paymentDetails.cardName.trim()) 
      errors.cardName = 'Name on card is required';
    
    if (!paymentDetails.cardNumber.trim()) 
      errors.cardNumber = 'Card number is required';
    else if (!/^\d{13,19}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) 
      errors.cardNumber = 'Please enter a valid card number';
    
    if (!paymentDetails.expiryDate.trim()) 
      errors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) 
      errors.expiryDate = 'Use format MM/YY';
    else {
      // Validate expiry date isn't in the past
      const [month, year] = paymentDetails.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1);
      const currentDate = new Date();
      if (expiryDate < currentDate) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentDetails.cvv.trim()) 
      errors.cvv = 'Security code is required';
    else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) 
      errors.cvv = 'Security code must be 3 or 4 digits';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handlePaymentSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      
      // Send payment details to API endpoint
      await processPayment({
        cardName: paymentDetails.cardName,
        cardNumber: paymentDetails.cardNumber,
        expiryDate: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
        sessionId,
        amount: total
      });
      
      // Mark cart as cleared before navigating
      cartCleared.current = true;
      
      // Navigate to success page
      navigate('/checkout?payment_status=success');
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("There was an error processing your payment. Please try again.");
      setLoading(false);
    }
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
            onNextStep={() => setActiveStep(1)}
            onSkipToSuccess={handleSkipToSuccess}
          />
        );
      case 1:
        return (
          <CheckoutStepPayment
            paymentDetails={paymentDetails}
            formErrors={formErrors}
            loading={loading}
            onInputChange={handleInputChange}
            onBackStep={() => setActiveStep(0)}
            onSubmitPayment={handlePaymentSubmit}
            onSkipToSuccess={handleSkipToSuccess}
          />
        );
      case 2:
        return (
          <CheckoutStepConfirmation
            onContinueShopping={handleContinueShopping}
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
