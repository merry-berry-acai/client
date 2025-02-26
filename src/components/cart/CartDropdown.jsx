import React, { useState, useContext } from 'react';
import { 
  Menu, 
  MenuItem, 
  Button, 
  Typography, 
  Box, 
  Badge, 
  IconButton,
  Divider,
  List,
  ListItem
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import CartItem from './CartItem';

const CartDropdown = () => {
  const { cartItems } = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  
  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let toppingTotal = 0;
      if (Array.isArray(item.customization)) {
        toppingTotal = item.customization.reduce((sum, topping) => sum + (topping.price || 0), 0);
      }
      return total + ((item.basePrice + toppingTotal) * (item.quantity || 1));
    }, 0);
  };

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

  // Get total number of items (including quantities)
  const itemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

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
            width: 320,
            maxHeight: 400,
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
            My Cart ({cartItems.length})
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Cart Items */}
        <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
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
                sx={{ mt: 1, textTransform: 'none', color: 'purple' }}
              >
                Browse our menu
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {cartItems.map((item, index) => (
                <React.Fragment key={`${item._id}-${index}`}>
                  <CartItem item={item} variant="dropdown" />
                  {index < cartItems.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
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
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
              
              {/* Cart Actions */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={viewFullCart}
                  sx={{ 
                    flex: 1, 
                    textTransform: 'none',
                    color: 'purple',
                    borderColor: 'purple',
                    '&:hover': {
                      borderColor: 'purple',
                    }
                  }}
                >
                  View Cart
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={goToCheckout}
                  sx={{ 
                    flex: 1, 
                    textTransform: 'none',
                    bgcolor: 'purple',
                    '&:hover': {
                      bgcolor: 'darkviolet',
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
    </Box>
  );
};

export default CartDropdown;
