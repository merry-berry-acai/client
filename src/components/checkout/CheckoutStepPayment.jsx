import React from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button
} from '@mui/material';

const CheckoutStepPayment = ({
  paymentDetails,
  formErrors,
  loading,
  onInputChange,
  onBackStep,
  onSubmitPayment,
  onSkipToSuccess
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name on Card"
              name="cardName"
              value={paymentDetails.cardName}
              onChange={onInputChange}
              error={!!formErrors.cardName}
              helperText={formErrors.cardName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={onInputChange}
              placeholder="XXXX XXXX XXXX XXXX"
              error={!!formErrors.cardNumber}
              helperText={formErrors.cardNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={onInputChange}
              placeholder="MM/YY"
              error={!!formErrors.expiryDate}
              helperText={formErrors.expiryDate}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={onInputChange}
              error={!!formErrors.cvv}
              helperText={formErrors.cvv}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Billing Address"
              name="billingAddress"
              value={paymentDetails.billingAddress}
              onChange={onInputChange}
              multiline
              rows={2}
              error={!!formErrors.billingAddress}
              helperText={formErrors.billingAddress}
            />
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
              }
            }}
          >
            Back to Review
          </Button>
          <Box>
            <Button 
              variant="contained"
              onClick={onSubmitPayment}
              disabled={loading}
              sx={{
                backgroundColor: '#8a2be2',
                '&:hover': { backgroundColor: '#6a1fb1' }
              }}
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </Button>
            
            {/* Development/Testing Fallback Button */}
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
            This is a mock checkout implementation. For testing, you can enter any valid-looking data 
            or use the "Skip to Success" button to bypass the payment process.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutStepPayment;
