import React, { useState, useContext } from 'react';
import { ListItem, ListItemText, Typography, Paper, Box, IconButton, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomizationModal from '../menu-browsing/CustomisationModal';
import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ item, variant }) => {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const { onUpdateCartItem, removeFromCart } = useContext(CartContext);

  const customisationText = Array.isArray(item.customization)
    ? item.customization.map(t => t.name).join(', ')
    : item.customization;

  const parsePrice = (priceStr) => parseFloat(priceStr.replace('$', ''));

  // Calculate base price and topping total
  let toppingTotal = 0;
  if (Array.isArray(item.customization)) {
    toppingTotal = item.customization.reduce((sum, t) => sum + (t.price ? parsePrice(t.price) : 0), 0);
  } else if (item.customization && item.customization.price) {
    toppingTotal = parsePrice(item.customization.price);
  }

  const baseTotal = item.basePrice + toppingTotal;
  const quantity = item.quantity || 1;
  const totalPrice = baseTotal * quantity;

  const handleInlineQuantityChange = (newQuantity) => {
    onUpdateCartItem({ ...item, quantity: newQuantity });
  };

  // New: Function to update customisation from the modal
  const handleCustomisationChange = (selectedToppings) => {
    onUpdateCartItem({ ...item, customization: selectedToppings });
    setCustomModalOpen(false);
  };

  const handleModalAdd = (updatedItem) => {
    onUpdateCartItem(updatedItem);
    setCustomModalOpen(false);
  };

  if (variant === 'dropdown') {
    return (
      <ListItem>
        <ListItemText
          primary={item.name}
          secondary={customisationText ? `Customisation: ${customisationText}` : null}
        />
        <IconButton onClick={() => removeFromCart(item.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }
  return (
    <Paper style={{ padding: 16, marginBottom: 8 }} elevation={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <img 
            src={item.image} 
            alt={item.name} 
            style={{ width: '120px', height: 'auto', borderRadius: 8 }} 
          />
          <div>
            <Typography variant="h6" style={{ marginBottom: 8 }}>{item.name}</Typography>
            {customisationText && (
              <ul>
                {Array.isArray(item.customization)
                  ? item.customization.map(t => (
                      <li key={t.id}>{t.name}</li>
                    ))
                  : <li>{item.customization}</li>}
              </ul>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>Quantity:</Typography>
              <IconButton size="small" onClick={() => handleInlineQuantityChange(Math.max(quantity - 1, 1))}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <Typography variant="body1" sx={{ mx: 1 }}>{quantity}</Typography>
              <IconButton size="small" onClick={() => handleInlineQuantityChange(quantity + 1)}>
                <AddCircleOutlineIcon />
              </IconButton>
              <Button variant="text" onClick={() => setCustomModalOpen(true)} sx={{ ml: 2 }}>
                Edit Customization
              </Button>
              <IconButton onClick={() => removeFromCart(item.id)} sx={{ ml: 1 }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </div>
        </div>
        <Box>
          <Typography variant="subtitle1" color="text.primary">
            ${totalPrice.toFixed(2)}
          </Typography>
          {/* New Price Breakdown */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Base Price: ${item.basePrice.toFixed(2)}</Typography>
            {Array.isArray(item.customization) && item.customization.length > 0 && (
              <>
                {item.customization.map(t => (
                  <Typography variant="body2" key={t.id}>
                    {t.name}: ${parsePrice(t.price).toFixed(2)}
                  </Typography>
                ))}
                <Typography variant="body2">
                  Toppings Total: ${toppingTotal.toFixed(2)}
                </Typography>
              </>
            )}
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Subtotal: ${(totalPrice).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
      {customModalOpen && (
        <CustomizationModal 
          open={customModalOpen} 
          onClose={() => setCustomModalOpen(false)} 
          item={item} 
          onAdd={handleCustomisationChange}
          variant="edit" 
        />
      )}
    </Paper>
  );
};

export default CartItem;
