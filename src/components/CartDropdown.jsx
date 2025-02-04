import React, { useState, useContext } from 'react';
import { Menu, MenuItem, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const CartDropdown = () => {
  const { cartItems } = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const viewFullCart = () => {
    handleClose();
    navigate('/cart');
  };

  return (
    <Box>
      <Button color="inherit" onClick={handleOpen}>
        Cart ({cartItems.length})
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {cartItems.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">
              Your cart is empty.
            </Typography>
          </MenuItem>
        ) : (
          cartItems.map((item, index) => (
            <MenuItem key={index}>
              <Typography variant="body2">
                {item.name} {item.customization && `- ${item.customization}`}
              </Typography>
            </MenuItem>
          ))
        )}
        <MenuItem onClick={viewFullCart}>
          <Button variant="text" fullWidth>
            View Full Cart
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CartDropdown;
