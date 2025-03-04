import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';

const SelectedToppings = ({ selectedToppings, toppingsTotal }) => {
  return (
    <Paper elevation={1} sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: '#f8f8f8' }}>
      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
        Selected Toppings:
      </Typography>
      {selectedToppings
        .filter(topping => topping && topping._id && typeof topping.price === 'number')
        .map(topping => (
          <Box 
            key={topping._id}
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 0.5
            }}
          >
            <Typography variant="body2">
              {topping.quantity} x {topping.name}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              ${(parseFloat(topping.price) * topping.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))
      }
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" fontWeight="medium">
          Toppings Subtotal:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          ${toppingsTotal.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SelectedToppings;
