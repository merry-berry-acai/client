import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import ToppingSelector from './ToppingSelector';
import SelectedToppings from './SelectedToppings';

const ToppingsPanel = ({ 
  toppings, 
  selectedToppings, 
  incrementTopping, 
  decrementTopping, 
  toppingsTotal, 
  maxToppingQuantity,
  debugMode 
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Select Your Toppings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You can add up to {maxToppingQuantity} of each topping.
      </Typography>
      
      <Box sx={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        }
      }}>
        <Grid container spacing={2}>
          {toppings === null || !Array.isArray(toppings) ? (
            <Grid item xs={12}>
              <Typography>Error loading toppings.</Typography>
            </Grid>
          ) : toppings.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No toppings available for this item.</Typography>
            </Grid>
          ) : (
            toppings.map(topping => {
              if (!topping || !topping._id || typeof topping.price !== 'number') {
                if (debugMode) console.warn('Skipping invalid topping:', topping);
                return null;
              }
              
              const selected = selectedToppings.find(t => t._id === topping._id);
              const isMaxReached = selected && selected.quantity >= maxToppingQuantity;
              
              return (
                <Grid item xs={12} sm={6} key={topping._id}>
                  <ToppingSelector 
                    topping={topping} 
                    selected={selected} 
                    onIncrement={incrementTopping} 
                    onDecrement={decrementTopping}
                    isMaxReached={isMaxReached}
                    maxQuantity={maxToppingQuantity}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
      
      {selectedToppings.length > 0 && (
        <SelectedToppings 
          selectedToppings={selectedToppings} 
          toppingsTotal={toppingsTotal} 
        />
      )}
    </>
  );
};

export default ToppingsPanel;
