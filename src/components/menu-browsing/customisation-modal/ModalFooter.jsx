import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ModalFooter = ({ 
  basePrice, 
  toppingsTotal, 
  quantity, 
  totalPrice, 
  onCancel, 
  onConfirm, 
  variant 
}) => {
  return (
    <Box sx={{ 
      mt: 3, 
      py: 2, 
      borderTop: '1px solid #e0e0e0',
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Base (${parseFloat(basePrice).toFixed(2)}) + Toppings (${toppingsTotal.toFixed(2)}) × Quantity ({quantity})
        </Typography>
        <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
      </Box>
      <Box>
        <Button 
          variant="outlined"
          onClick={onCancel} 
          sx={{ 
            mr: 2,
            color: '#8a2be2',
            borderColor: '#8a2be2',
            '&:hover': {
              borderColor: '#6a1fb1',
              backgroundColor: 'rgba(138, 43, 226, 0.08)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={onConfirm} 
          sx={{ 
            color: '#ffffff', 
            backgroundColor: '#8a2be2', 
            '&:hover': { backgroundColor: '#6a1fb1' },
            px: 3
          }}
        >
          {variant === 'edit' ? 'Update Item' : 'Add to Cart'}
        </Button>
      </Box>
    </Box>
  );
};

export default ModalFooter;
