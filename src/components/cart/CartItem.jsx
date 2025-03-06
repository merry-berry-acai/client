import React, { useState, useContext } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  IconButton, 
  Button,
  Grid,
  Divider,
  ButtonGroup,
  ListItem,
  ListItemText,
  Collapse,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CustomizationModal from '../menu-browsing/CustomisationModal';
import { CartContext } from '../../contexts/CartContext';
import { MenuContext } from '../../contexts/MenuContext';
import AppImage from '../common/AppImage';

const CartItem = ({ item, variant }) => {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [showCustomizations, setShowCustomizations] = useState(false);
  const { onUpdateCartItem, removeFromCart, getFullCartItem } = useContext(CartContext);
  const { menuItems } = useContext(MenuContext);
  
  // Get the full item with image data from menu context
  const fullItem = getFullCartItem(item);

  // Calculate base price and topping total with validation
  let toppingTotal = 0;
  const normalizedCustomization = Array.isArray(item.customization) ? item.customization : [];
  const hasCustomizations = normalizedCustomization.length > 0;
  
  if (hasCustomizations) {
    toppingTotal = normalizedCustomization.reduce((sum, t) => {
      // Ensure we have valid numbers
      const price = typeof t.price === 'number' ? t.price : parseFloat(t.price || 0);
      const quantity = t.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  }

  const baseTotal = parseFloat(item.basePrice || 0) + toppingTotal;
  const quantity = item.quantity || 1;
  const totalPrice = baseTotal * quantity;

  // Format a summary of customizations for compact display
  const formatCustomizationSummary = () => {
    if (!hasCustomizations) return "";
    
    if (normalizedCustomization.length === 1) {
      const topping = normalizedCustomization[0];
      return `${topping.quantity || 1}× ${topping.name}`;
    }
    
    return `${normalizedCustomization.length} topping${normalizedCustomization.length > 1 ? 's' : ''}`;
  };

  const handleInlineQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateCartItem({ ...item, quantity: newQuantity });
  };

  const handleCustomisationChange = (updatedItem) => {
    onUpdateCartItem(updatedItem);
    setCustomModalOpen(false);
  };

  const handleRemoveItem = () => {
    // Use cartItemId if available for more reliable removal
    if (item.cartItemId) {
      removeFromCart(item._id, item.customization, item.cartItemId);
    } else {
      removeFromCart(item._id, item.customization);
    }
  };

  // Dropdown variant for mini-cart
  if (variant === 'dropdown') {
    return (
      <ListItem>
        <ListItemText
          primary={item.name}
          secondary={hasCustomizations ? formatCustomizationSummary() : null}
        />
        <Typography variant="body2" sx={{ mx: 2 }}>${totalPrice.toFixed(2)}</Typography>
        <IconButton size="small" onClick={handleRemoveItem}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </ListItem>
    );
  }

  // Checkout variant (read-only, simplified view)
  if (variant === 'checkout') {
    return (
      <Box sx={{ mb: 2, py: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3} sm={2}>
            <AppImage
              src={fullItem}
              alt={item.name}
              fallbackSrc="/assets/default-food.png"
              sx={{ 
                width: '100%', 
                height: '60px',
                borderRadius: 1
              }}
            />
          </Grid>
          <Grid item xs={9} sm={10}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Qty: {quantity}
            </Typography>
            {hasCustomizations && (
              <Typography variant="body2" color="text.secondary">
                {normalizedCustomization.map(c => c.name).join(', ')}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
      </Box>
    );
  }

  // Main cart view
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 2,
        p: 2,
        border: '1px solid #eee',
        borderRadius: 2
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Product Image */}
        <Grid item xs={3} sm={2}>
          <AppImage
            src={fullItem.imageUrl}
            alt={item.name}
            fallbackSrc="/assets/default-food.png"
            sx={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: 8,
              maxWidth: '100px',
              aspectRatio: '1/1'
            }}
          />
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={9} sm={4}>
          <Typography variant="h6" gutterBottom>{item.name}</Typography>
          
          {hasCustomizations && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={formatCustomizationSummary()}
                size="small"
                color="primary"
                sx={{ 
                  bgcolor: 'rgba(138, 43, 226, 0.1)', 
                  color: '#6a1fb1',
                  borderRadius: '4px',
                  mr: 1
                }}
              />
              <Button
                size="small"
                onClick={() => setShowCustomizations(!showCustomizations)}
                endIcon={showCustomizations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ 
                  textTransform: 'none', 
                  p: 0, 
                  minWidth: 0,
                  fontSize: '0.75rem',
                  color: '#8a2be2'
                }}
              >
                {showCustomizations ? 'Hide details' : 'View details'}
              </Button>
            </Box>
          )}
          
          {/* Collapsible customization details */}
          {hasCustomizations && (
            <Collapse in={showCustomizations}>
              <Box 
                sx={{
                  bgcolor: '#f8f8f8',
                  borderRadius: 1,
                  p: 1,
                  mb: 1.5,
                  fontSize: '0.875rem'
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Customization Details:
                </Typography>
                
                {item.customization.map((topping, idx) => (
                  <Box 
                    key={`${topping._id || idx}`} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 0.25
                    }}
                  >
                    <Typography variant="body2">
                      {topping.quantity || 1}× {topping.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${((topping.price || 0) * (topping.quantity || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                
                {toppingTotal > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, pt: 0.5, borderTop: '1px dashed #ddd' }}>
                    <Typography variant="body2" fontWeight="medium">
                      Toppings total:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      ${toppingTotal.toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          )}
          
          <Button 
            size="small" 
            onClick={() => setCustomModalOpen(true)} 
            sx={{ 
              textTransform: 'none', 
              p: 0,
              color: '#8a2be2'
            }}
          >
            Edit customization
          </Button>
        </Grid>
        
        {/* Quantity Controls */}
        <Grid item xs={6} sm={2}>
          <ButtonGroup size="small" aria-label="quantity control" sx={{ 
            border: '1px solid rgba(0, 0, 0, 0.12)', 
            borderRadius: 1
          }}>
            <IconButton 
              onClick={() => handleInlineQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              sx={{ 
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                '&:hover': { color: '#8a2be2' } 
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Button 
              disableRipple 
              sx={{ 
                minWidth: 40,
                '&:hover': {
                  bgcolor: 'transparent'
                }
              }}
            >
              {quantity}
            </Button>
            <IconButton 
              onClick={() => handleInlineQuantityChange(quantity + 1)}
              sx={{ 
                borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
                '&:hover': { color: '#8a2be2' } 
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>
        </Grid>
        
        {/* Price */}
        <Grid item xs={4} sm={2} textAlign="right">
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            ${totalPrice.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="text.secondary">
              ${item.basePrice.toFixed(2)} base
            </Typography>
            {toppingTotal > 0 && (
              <Typography variant="caption" color="text.secondary">
                +${toppingTotal.toFixed(2)} extras
              </Typography>
            )}
          </Box>
        </Grid>
        
        {/* Remove Button */}
        <Grid item xs={2} textAlign="right">
          <IconButton 
            color="default" 
            onClick={handleRemoveItem}
            size="small"
            sx={{
              '&:hover': {
                color: '#f44336',
              }
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>

      {customModalOpen && (
        <CustomizationModal 
          open={customModalOpen} 
          onClose={() => setCustomModalOpen(false)} 
          item={fullItem} 
          onAdd={handleCustomisationChange}
          variant="edit" 
        />
      )}
    </Paper>
  );
};

export default CartItem;
