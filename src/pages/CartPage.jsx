import React, { useContext } from 'react';
import { Container, Typography, List, Divider, Button, Box } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // New: Helper to parse and calculate each item's total price
  const parsePrice = (price) => parseFloat(price.toString().replace('$', ''));
  
  const calculateItemTotal = (item) => {
    const basePrice = parsePrice(item.price);
    let toppingTotal = 0;
    if (Array.isArray(item.customization)) {
      toppingTotal = item.customization.reduce((sum, t) => sum + (t.price ? parsePrice(t.price) * (t.quantity || 1) : 0), 0);
    } else if (item.customization && item.customization.price) {
      toppingTotal = parsePrice(item.customization.price);
    }
    const baseTotal = basePrice + toppingTotal;
    const quantity = item.quantity || 1;
    return baseTotal * quantity;
  };

  // New: Calculate cart totals
  const cartSubtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const gst = cartSubtotal * 0.10;
  const grandTotal = cartSubtotal + gst;

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
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Typography variant="body1">Subtotal: ${cartSubtotal.toFixed(2)}</Typography>
              <Typography variant="body1">GST (10%): ${gst.toFixed(2)}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                Grand Total: ${grandTotal.toFixed(2)}
              </Typography>
            </Box>
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

