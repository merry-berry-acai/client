import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Box, Button, IconButton } from '@mui/material';
import { TOPPINGS } from '../../api/mockApi';
import ToppingSelector from './ToppingSelector';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const CustomisationModal = ({ open, onClose, onAdd, item, variant = 'new' }) => {
  const [selectedToppings, setSelectedToppings] = useState(() => {
    const existing = variant === 'edit'
      ? (Array.isArray(item.customization) ? item.customization : [])
      : (item.toppings || []);
    return existing.map(t => ({ ...t, quantity: t.quantity || 1 }));
  });
  // New: State for item quantity
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const parsePrice = (price) => parseFloat(price.toString().replace('$', ''));
  const basePrice = parsePrice(item.price);
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + (parsePrice(t.price) * t.quantity), 0);
  const totalPrice = (basePrice + toppingsTotal) * quantity;

  const incrementTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.map(t => t.id === topping.id ? { ...t, quantity: t.quantity + 1 } : t);
      }
      return [...prev, { ...topping, quantity: 1 }];
    });
  };

  const decrementTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists && exists.quantity > 1) {
        return prev.map(t => t.id === topping.id ? { ...t, quantity: t.quantity - 1 } : t);
      }
      return prev.filter(t => t.id !== topping.id);
    });
  };

  // New: Handlers for quantity adjustment
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  // Update: Pass updated item with separate "customization" and "quantity"
  const handleAdd = () => {
    onAdd({ ...item, customization: selectedToppings, quantity });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#0097b2' }}>
          {variant === 'edit' ? `Edit Customisation for ${item.name}` : `Customise ${item.name}`}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>Quantity:</Typography>
                <IconButton size="small" onClick={decrementQuantity}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 1 }}>{quantity}</Typography>
                <IconButton size="small" onClick={incrementQuantity}>
                  <AddCircleOutlineIcon />
                </IconButton>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                {TOPPINGS.map(topping => {
                  const selected = selectedToppings.find(t => t.id === topping.id);
                  return (
                    <ToppingSelector 
                      key={topping.id} 
                      topping={topping} 
                      selected={selected} 
                      onIncrement={incrementTopping} 
                      onDecrement={decrementTopping} 
                    />
                  );
                })}
              </Box>
              {/* New: Item quantity adjustment */}
             
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleAdd} 
          sx={{ color: '#ffffff', backgroundColor: '#0097b2', '&:hover': { backgroundColor: '#0097b2' } }}
        >
          {variant === 'edit' ? 'Update Customization' : 'Add to Cart'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomisationModal;
