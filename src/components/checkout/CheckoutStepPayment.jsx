import React from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import StripeWrapper from './StripeWrapper';

const CheckoutStepPayment = ({
  clientSecret,
  orderId,
  loading,
  onBackStep,
  onPaymentSuccess,
  onPaymentError,
  onSkipToSuccess
}) => {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
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
            bgcolor: 'background.paper',
            borderRadius: 1
          }}
        >
          <Box 
            component="img"
            src="/visa-logo.svg" 
            alt="Visa" 
            sx={{ 
              height: 24, 
              width: 'auto',
              filter: 'grayscale(0.2)'
            }}
          />
          <Box 
            component="img"
            src="/mastercard-logo.svg" 
            alt="MasterCard" 
            sx={{ 
              height: 30, 
              width: 'auto',
              filter: 'grayscale(0.2)'
            }}
          />
          <Box 
            component="img"
            src="/amex-logo.svg" 
            alt="American Express" 
            sx={{ 
              height: 24, 
              width: 'auto',
              filter: 'grayscale(0.2)'
            }}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
            <LockIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
            All transactions are secure and encrypted
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Card Information
        </Typography>
        
        {/* Stripe Payment Component */}
        <StripeWrapper
          clientSecret={clientSecret}
          orderId={orderId}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      </Paper>
      
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
          DEV: Skip to Success
        </Button>
      </Box>

      {/* Add development notice */}
      <Box 
        sx={{ 
          mt: 3, 
          p: 1.5, 
          bgcolor: 'info.light', 
          color: 'info.contrastText',
          borderRadius: 1,
          fontSize: '0.875rem'
        }}
      >
        <Typography variant="subtitle2">
          Development Mode
        </Typography>
        <Typography variant="body2">
          This is a mock checkout implementation. For testing, you can use the Stripe test card number 4242 4242 4242 4242,
          any future date for expiry, and any 3 digits for CVC. Or use the "Skip to Success" button to bypass the payment process.
        </Typography>
      </Box>
    </Box>
  );
};

export default CheckoutStepPayment;
