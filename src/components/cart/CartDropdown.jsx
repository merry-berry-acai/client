import React, { useState, useContext } from 'react';
import { 
  Menu, 
  Button, 
  Typography, 
  Box, 
  Badge, 
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tooltip
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import CustomizationModal from '../menu-browsing/CustomisationModal';
import AppImage from '../common/AppImage';

const CartDropdown = () => {
  // Add fallback with default values
  const { 
    cartItems = [], 
    cartTotal = 0, 
    removeFromCart = () => {}, 
    onUpdateCartItem = () => {}, 
    getFullCartItem = (item) => item 
  } = useContext(CartContext) || {};
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  
  // Get total number of items (including quantities)
  const itemCount = cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 1), 0);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const viewFullCart = () => {
    handleClose();
    navigate('/cart');
  };
  
  const goToCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  const handleEditItem = (item) => {
    // Get the full item with image data from context
    const fullItem = getFullCartItem(item);
    setEditingItem(fullItem);
  };

  const handleCustomizationSave = (updatedItem) => {
    onUpdateCartItem(updatedItem);
    setEditingItem(null);
  };

  const handleRemoveItem = (cartItemId) => {
    if (cartItemId) {
      removeFromCart(null, null, cartItemId);
    }
  };

  return (
    <Box>
      <IconButton 
        color="inherit" 
        onClick={handleOpen}
        aria-label="shopping cart"
        aria-controls={open ? 'cart-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge 
          badgeContent={itemCount} 
          color="error"
          max={99}
          overlap="circular"
        >
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>
      
      <Menu 
        id="cart-menu"
        anchorEl={anchorEl} 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 350,
            maxHeight: 500,
            overflow: 'auto',
            borderRadius: 2,
            mt: 1.5
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Cart Header */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            My Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Cart Items */}
        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
          {cartItems.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Your cart is empty
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => { 
                  handleClose(); 
                  navigate('/menu'); 
                }}
                sx={{ mt: 1, textTransform: 'none', color: '#8a2be2' }}
              >
                Browse our menu
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {cartItems.map((item, index) => {
                // Get the full item with image data
                const fullItem = getFullCartItem(item);
                
                // Get customization summary
                const normalizedCustomization = Array.isArray(item.customization) ? item.customization : [];
                const hasCustomizations = normalizedCustomization.length > 0;
                
                // Format customization text
                let customizationText = "";
                if (hasCustomizations) {
                  if (normalizedCustomization.length === 1) {
                    const topping = normalizedCustomization[0];
                    customizationText = `${topping.quantity || 1}× ${topping.name}`;
                  } else {
                    customizationText = `${normalizedCustomization.length} toppings`;
                  }
                }
                
                // Calculate individual item total
                const basePrice = parseFloat(item.basePrice || 0);
                const toppingsPrice = normalizedCustomization.reduce((sum, t) => 
                  sum + ((parseFloat(t.price) || 0) * (parseInt(t.quantity) || 1)), 0);
                const itemTotal = (basePrice + toppingsPrice) * (parseInt(item.quantity) || 1);
                
                return (
                  <React.Fragment key={item.cartItemId || `${item._id}-${index}`}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 1.5, 
                        "&:hover": { bgcolor: 'rgba(0,0,0,0.03)' } 
                      }}
                    >
                      {/* Item Image */}
                      <ListItemAvatar sx={{ minWidth: 50 }}>
                        <Avatar 
                          variant="rounded"
                          sx={{ width: 42, height: 42, borderRadius: 1 }}
                        >
                          <AppImage 
                            src={fullItem}
                            alt={item.name}
                            fallbackSrc="/assets/default-food.png"
                          />
                        </Avatar>
                      </ListItemAvatar>
                      
                      {/* Item Details */}
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 6 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              ${!isNaN(itemTotal) ? itemTotal.toFixed(2) : '0.00'}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" component="span">
                              Qty: {item.quantity || 1}
                            </Typography>
                            {hasCustomizations && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                component="span"
                                sx={{ display: 'block', fontSize: '0.75rem', color: 'primary.light' }}
                              >
                                {customizationText}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      
                      {/* Action Buttons */}
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit item">
                          <IconButton 
                            edge="end" 
                            aria-label="edit" 
                            size="small"
                            onClick={() => handleEditItem(item)}
                            sx={{ 
                              mr: 0.5,
                              '&:hover': { color: '#8a2be2' }
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove item">
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            size="small"
                            onClick={() => handleRemoveItem(item.cartItemId)}
                            sx={{ 
                              '&:hover': { color: '#f44336' }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
        
        {cartItems.length > 0 && (
          <>
            <Divider />
            
            {/* Cart Total */}
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${cartTotal.toFixed(2)}
                </Typography>
              </Box>
              
              {/* Cart Actions */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={viewFullCart}
                  fullWidth
                  sx={{ 
                    textTransform: 'none',
                    color: '#8a2be2',
                    borderColor: '#8a2be2',
                    '&:hover': {
                      borderColor: '#6a1fb1',
                    }
                  }}
                >
                  View Cart
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={goToCheckout}
                  fullWidth
                  sx={{ 
                    textTransform: 'none',
                    bgcolor: '#8a2be2',
                    '&:hover': {
                      bgcolor: '#6a1fb1',
                    }
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Menu>
      
      {/* Customization Modal for editing */}
      {editingItem && (
        <CustomizationModal
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          item={editingItem}
          onAdd={handleCustomizationSave}
          variant="edit"
        />
      )}
    </Box>
  );
};

export default CartDropdown;
