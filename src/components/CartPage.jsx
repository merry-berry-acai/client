import React, { useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // ...checkout logic...
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={item.customization ? `Customization: ${item.customization}` : null}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ mt: 2 }}>
            Checkout
          </Button>
        </>
      )}
      <Button variant="text" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Continue Shopping
      </Button>
    </Container>
  );
};

export default Cart

