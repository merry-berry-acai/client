import React, { useState, useContext, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, 
  Grid, Box, Button, IconButton, Divider, Paper, Collapse
} from '@mui/material';
import ToppingSelector from './ToppingSelector';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import { MenuContext } from '../../contexts/MenuContext';

// Enable this for development debugging
const DEBUG_MODE = true;
// Maximum quantity for a single topping
const MAX_TOPPING_QUANTITY = 3;

const CustomisationModal = ({ open, onClose, onAdd, item, variant = 'new' }) => {
  const { toppings } = useContext(MenuContext);
  
  // Sanitize initial toppings to ensure they have all required properties
  const [selectedToppings, setSelectedToppings] = useState(() => {
    const existing = variant === 'edit'
      ? (Array.isArray(item.customization) ? item.customization : [])
      : (item.toppings || []);
    
    // Filter out invalid entries and ensure all required properties exist
    return existing
      .filter(t => t && t._id && t.name && typeof t.price === 'number')
      .map(t => ({ 
        ...t, 
        quantity: t.quantity || 1,
        // Ensure price is a valid number
        price: typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0
      }));
  });
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [showDebug, setShowDebug] = useState(false);

  // Calculate prices with proper decimal precision and validation
  const toppingsTotal = selectedToppings.reduce((sum, t) => {
    // Ensure we have valid numbers before calculation
    if (!t || typeof t.price !== 'number' || !t.quantity) {
      if (DEBUG_MODE) console.warn('Invalid topping found:', t);
      return sum;
    }
    return sum + (parseFloat((t.price * t.quantity).toFixed(2)));
  }, 0);
  
  // Ensure base price is a number and properly formatted
  const basePrice = parseFloat(item.basePrice || 0).toFixed(2);
  
  // Calculate total with proper formatting
  const totalPrice = parseFloat(
    ((parseFloat(basePrice) + toppingsTotal) * quantity).toFixed(2)
  );


  // Log any changes to selected toppings

  const incrementTopping = (topping) => {
    // Validate topping object
    if (!topping || !topping._id || typeof topping.price !== 'number') {
      if (DEBUG_MODE) console.error('Cannot add invalid topping:', topping);
      return;
    }

    setSelectedToppings(prev => {
      const exists = prev.find(t => t._id === topping._id);
      if (exists) {
        // Check if maximum quantity has been reached
        if (exists.quantity >= MAX_TOPPING_QUANTITY) {
          if (DEBUG_MODE) console.log(`Maximum quantity (${MAX_TOPPING_QUANTITY}) reached for ${topping.name}`);
          return prev; // Don't update if at max
        }
        
        const updated = prev.map(t => 
          t._id === topping._id ? { ...t, quantity: t.quantity + 1 } : t
        );
        if (DEBUG_MODE) console.log(`Increased quantity of ${topping.name} to ${exists.quantity + 1}`);
        return updated;
      }
      if (DEBUG_MODE) console.log(`Added new topping: ${topping.name}`);
      // Ensure we add a complete topping object
      return [...prev, { 
        _id: topping._id,
        name: topping.name,
        price: topping.price,
        quantity: 1 
      }];
    });
  };

  const decrementTopping = (topping) => {
    // Validate topping object
    if (!topping || !topping._id) {
      if (DEBUG_MODE) console.error('Cannot remove invalid topping:', topping);
      return;
    }

    setSelectedToppings(prev => {
      const exists = prev.find(t => t._id === topping._id);
      if (exists && exists.quantity > 1) {
        const updated = prev.map(t => 
          t._id === topping._id ? { ...t, quantity: t.quantity - 1 } : t
        );
        if (DEBUG_MODE) console.log(`Decreased quantity of ${topping.name} to ${exists.quantity - 1}`);
        return updated;
      }
      if (DEBUG_MODE) console.log(`Removed topping: ${topping.name}`);
      return prev.filter(t => t._id !== topping._id);
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      const newQty = prev + 1;
      if (DEBUG_MODE) console.log(`Increased item quantity to ${newQty}`);
      return newQty;
    });
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => {
      const newQty = Math.max(prev - 1, 1);
      if (DEBUG_MODE) console.log(`Decreased item quantity to ${newQty}`);
      return newQty;
    });
  };

  const handleAdd = () => {
    // Filter any potentially invalid toppings before submitting
    const validToppings = selectedToppings.filter(
      t => t && t._id && t.name && typeof t.price === 'number'
    );
    
    const finalItem = { 
      ...item, 
      customization: validToppings, 
      quantity,
      // Include calculated prices for reference
      calculatedItemTotal: totalPrice
    };
    
    onAdd(finalItem);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#f8f8f8', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#8a2be2' }}>
          {variant === 'edit' ? `Edit ${item.name}` : `Customise Your ${item.name}`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {DEBUG_MODE && (
            <IconButton 
              onClick={() => setShowDebug(!showDebug)} 
              aria-label="debug" 
              size="small"
              color={showDebug ? "primary" : "default"}
              sx={{ mr: 1 }}
            >
              <BugReportIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} aria-label="close" size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {DEBUG_MODE && (
        <Collapse in={showDebug}>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px dashed #ccc' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Debug Information:</Typography>
            <Box component="pre" sx={{ 
              fontSize: '0.75rem', 
              p: 1, 
              bgcolor: '#2d2d2d', 
              color: '#e0e0e0',
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 150
            }}>
              {JSON.stringify({
                item: {
                  id: item._id,
                  name: item.name,
                  basePrice: parseFloat(basePrice),
                },
                quantity,
                selectedToppings: selectedToppings
                  .filter(t => t && t._id && typeof t.price === 'number')
                  .map(t => ({
                    id: t._id,
                    name: t.name,
                    price: t.price,
                    quantity: t.quantity,
                    itemTotal: parseFloat((t.price * t.quantity).toFixed(2))
                  })),
                toppingsTotal: parseFloat(toppingsTotal.toFixed(2)),
                totalPrice: totalPrice
              }, null, 2)}
            </Box>
          </Box>
        </Collapse>
      )}
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{
                  width: '100%',
                  height: 180,
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#f5f5f5'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
              
              <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                {item.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                {item.details}
              </Typography>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="subtitle1">Base price:</Typography>
                <Typography variant="subtitle1" fontWeight="medium">${parseFloat(basePrice).toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: 2 }}>
                <Typography variant="subtitle2" mb={1}>Quantity:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button 
                    variant="outlined"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    sx={{ 
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      p: 0,
                      color: '#8a2be2',
                      borderColor: '#8a2be2',
                      '&:hover': {
                        borderColor: '#6a1fb1',
                        backgroundColor: 'rgba(138, 43, 226, 0.08)'
                      }
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Typography variant="h6" sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>{quantity}</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={incrementQuantity}
                    sx={{ 
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      p: 0,
                      color: '#8a2be2',
                      borderColor: '#8a2be2',
                      '&:hover': {
                        borderColor: '#6a1fb1',
                        backgroundColor: 'rgba(138, 43, 226, 0.08)'
                      }
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Your Toppings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You can add up to {MAX_TOPPING_QUANTITY} of each topping.
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
                      if (DEBUG_MODE) console.warn('Skipping invalid topping:', topping);
                      return null;
                    }
                    
                    const selected = selectedToppings.find(t => t._id === topping._id);
                    const isMaxReached = selected && selected.quantity >= MAX_TOPPING_QUANTITY;
                    
                    return (
                      <Grid item xs={12} sm={6} key={topping._id}>
                        <ToppingSelector 
                          topping={topping} 
                          selected={selected} 
                          onIncrement={incrementTopping} 
                          onDecrement={decrementTopping}
                          isMaxReached={isMaxReached}
                          maxQuantity={MAX_TOPPING_QUANTITY}
                        />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Box>
            
            {selectedToppings.length > 0 && (
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
            )}
          </Grid>
        </Grid>
        
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
              onClick={onClose} 
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
              onClick={handleAdd} 
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomisationModal;
