import React from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';

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
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name on Card"
              name="cardName"
              value={paymentDetails.cardName}
              onChange={onInputChange}
              error={!!formErrors.cardName}
              helperText={formErrors.cardName || "Exactly as shown on the card"}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={onInputChange}
              placeholder="1234 5678 9012 3456"
              error={!!formErrors.cardNumber}
              helperText={formErrors.cardNumber}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon color="action" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 19,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={onInputChange}
              placeholder="MM/YY"
              error={!!formErrors.expiryDate}
              helperText={formErrors.expiryDate}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 5,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              fullWidth
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={onInputChange}
              error={!!formErrors.cvv}
              helperText={formErrors.cvv || "3-4 digits on back of card"}
              variant="outlined"
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SecurityIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 4,
              }}
            />
          </Grid>
        </Grid>
        )}
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
        <Box>
          <Button 
            variant="contained"
            onClick={onSubmitPayment}
            disabled={loading}
            sx={{
              backgroundColor: '#8a2be2',
              '&:hover': { backgroundColor: '#6a1fb1' },
              py: 1.2,
              px: 3,
              minWidth: 180
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
          >
            {loading ? 'Processing...' : 'Pay Securely'}
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
  );
};

export default CheckoutStepPayment;
