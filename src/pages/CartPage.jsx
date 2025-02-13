import React, { useContext } from 'react';
import { Container, Typography, List, Divider, Button } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // ...checkout logic...
  };

  return (
    <Layout>
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
                  <CartItem item={item} variant="page" />
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
    </Layout>
  );
};

export default Cart;

