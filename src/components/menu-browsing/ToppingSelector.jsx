import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';

const ToppingSelector = ({ topping, selected, onIncrement, onDecrement }) => {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body2">{topping.name}</Typography>
      <Typography variant="caption">{topping.price}</Typography>
      {!selected ? (
        <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => onIncrement(topping)}>
          Add
        </Button>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
          <IconButton size="small" onClick={() => onDecrement(topping)}>-</IconButton>
          <Typography variant="body2" sx={{ mx: 1 }}>{selected.quantity}</Typography>
          <IconButton size="small" onClick={() => onIncrement(topping)}>+</IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ToppingSelector;
