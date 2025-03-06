import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Divider
} from '@mui/material';
import { 
  Home as HomeIcon, 
  ShoppingBag as ShoppingBagIcon,
  CheckCircleOutline as CheckCircleOutlineIcon 
} from '@mui/icons-material';
import { formatOrderId } from '../../utils/orderUtils';

const CheckoutStepConfirmation = ({ onContinueShopping, orderId }) => {
  // Generate a random order number for demo purposes
  // Use the orderId from props if available, otherwise generate a temporary one
  const orderNumber = orderId ? formatOrderId(orderId) : `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
      <CheckCircleOutlineIcon 
        sx={{ 
          fontSize: 60, 
          color: 'success.main', 
          mb: 2 
        }} 
      />
      
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        Thank You!
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        Your order has been placed successfully
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%', 
          maxWidth: 500, 
          p: 3, 
          mb: 4,
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Order Number:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {orderNumber}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Date:
          </Typography>
          <Typography variant="subtitle1">
            {orderDate}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Payment Status:
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 'medium' }}>
            Paid
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" paragraph>
          We've sent a confirmation email to your registered email address with all the order details.
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          Your order will be ready for pickup in approximately:
        </Typography>
        
        <Typography variant="h6" sx={{ color: '#8a2be2', fontWeight: 'bold', textAlign: 'center', my: 2 }}>
          15-20 minutes
        </Typography>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          href="/"
          sx={{
            borderColor: '#8a2be2',
            color: '#8a2be2',
            '&:hover': {
              borderColor: '#6a1fb1',
              backgroundColor: 'rgba(138, 43, 226, 0.08)'
            },
            px: 3,
            py: 1
          }}
        >
          Home
        </Button>
        
        <Button
          variant="contained"
          startIcon={<ShoppingBagIcon />}
          onClick={onContinueShopping}
          sx={{
            backgroundColor: '#8a2be2',
            '&:hover': { backgroundColor: '#6a1fb1' },
            px: 3,
            py: 1
          }}
        >
          Order More
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutStepConfirmation;
