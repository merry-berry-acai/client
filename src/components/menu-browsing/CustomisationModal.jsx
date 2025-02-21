import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Box, Button } from '@mui/material';
import { TOPPINGS } from '../../api/mockApi';

const CustomisationModal = ({ open, onClose, onAdd, item }) => {
  // Initialize selected toppings with item's default toppings (or empty if none)
  const [selectedToppings, setSelectedToppings] = useState(() => item.toppings || []);

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const handleAdd = () => {
    onAdd(selectedToppings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#0097b2' }}>
          Customise {item.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'purple',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src={item.image} alt={item.name} className={'item-image'} />
              <Typography variant="h6" component="div" sx={{ color: '#ffffff', marginBottom: '8px' }}>
                {item.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                From {item.price}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: '#e0e0e0',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
                {item.details}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Select Toppings:
              </Typography>
              {/* New details section */}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {TOPPINGS.map(topping => {
                  const isSelected = selectedToppings.some(t => t.id === topping.id);
                  return (
                    <Button
                      key={topping.id}
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => toggleTopping(topping)}
                    >
                      {topping.name}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleAdd} 
          sx={{ color: '#ffffff', backgroundColor: '#0097b2', '&:hover': { backgroundColor: '#0097b2' } }}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomisationModal;
