import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Divider,
  Card,
  CardContent,
  Link,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CartItem from '../components/cart/CartItem';
import { CartContext } from '../contexts/CartContext';
import Layout from '../components/Layout';
import DebugPanel from '../components/DebugPanel';
import EducatorNote from '../components/EducatorNote';

const CartPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  // Calculate order summary values
  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => {
      // Calculate topping price
      let toppingTotal = 0;
      if (Array.isArray(item?.customization)) {
        toppingTotal = item.customization.reduce((sum, topping) => sum + (topping?.price || 0), 0);
      }
      return total + ((item?.basePrice || 0) + toppingTotal) * (item?.quantity || 1);
    }, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // Example: 10% tax
  const total = subtotal + tax;
  
  // Empty cart state
  if (!cartItems?.length) {
    return (
      <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2,
            border: '1px solid #eee' 
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your Cart is Empty</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/menu" 
            sx={{ 
              mt: 2,
              backgroundColor: '#8a2be2',
              '&:hover': {
                backgroundColor: '#6a1fb1'
              }
            }}
          >
            Browse Our Menu
          </Button>
        </Paper>
      </Container>
      </Layout>
    );
  }

  return (
    <Layout>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Your Shopping Cart
      </Typography>
      
      {/* Educator Note */}
      <EducatorNote sx={{ mb: 3 }}>
        <Typography variant="body2">
          This cart implements React Context for state management. Try adding items from the menu, adjusting quantities, 
          and proceeding to checkout to see how context maintains state across your shopping experience.
        </Typography>
      </EducatorNote>
        
      {/* Rest of the cart content */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
            Your Cart
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: 2, color: 'text.secondary' }}>
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </Typography>
        </Box>
        <Button 
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/menu"
          sx={{ 
            textTransform: 'none',
            color: '#8a2be2',
            '&:hover': {
              backgroundColor: 'rgba(138, 43, 226, 0.08)'
            }
          }}
        >
          Continue Shopping
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items Section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              startIcon={<DeleteSweepIcon />}
              size="small"
              onClick={clearCart}
              sx={{ 
                textTransform: 'none',
                color: '#8a2be2',
                '&:hover': {
                  backgroundColor: 'rgba(138, 43, 226, 0.08)'
                }
              }}
            >
              Clear Cart
            </Button>
          </Box>
          
          {cartItems?.map((item, index) => (
            <CartItem key={`${item?._id}-${index}`} item={item} />
          ))}
        </Grid>

        {/* Order Summary Section */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid #eee',
              position: { md: 'sticky' },
              top: { md: '2rem' }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Tax (10%)</Typography>
                <Typography variant="body1">${tax.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                component={RouterLink}
                to="/checkout"
                sx={{ 
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  backgroundColor: '#8a2be2',
                  '&:hover': {
                    backgroundColor: '#6a1fb1'
                  }
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Need help? <Link href="/contact" underline="hover" sx={{ color: '#8a2be2' }}>Contact us</Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    <DebugPanel 
      componentName="CartPage" 
      props={{}} 
      contextData={{ 
        cartItemsCount: cartItems?.length,
        subtotal,
        tax,
        total,
      }}
    />
    </Layout>
  );
};

export default CartPage;

