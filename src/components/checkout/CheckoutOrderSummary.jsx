import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider 
} from '@mui/material';

const CheckoutOrderSummary = ({ subtotal, tax, total }) => {
  return (
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
  );
};

export default CheckoutOrderSummary;
