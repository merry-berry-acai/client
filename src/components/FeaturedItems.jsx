import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Box } from '@mui/material';
import { CartContext } from '../contexts/CartContext';

function FeaturedItem({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [customOption, setCustomOption] = useState("");
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item, customOption);
    toast.success(`${item.name} added to cart with customization: ${customOption || "None"}`);
    setShowModal(false);
    // ...additional add-to-cart logic...
  };

  return (
    <Card>
      <CardMedia component="img" height="180" image={item.image} title={item.name} />
      <CardContent>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2" color="textSecondary">{item.description}</Typography>
      </CardContent>
      <CardActions>
        <Typography variant="body1" color="primary" sx={{ flexGrow: 1 }}>
          ${item.price.toFixed(2)}
        </Typography>
        <Button onClick={() => setShowModal(true)} variant="contained" color="primary">
          Add to Cart
        </Button>
      </CardActions>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogTitle>
          <Typography variant="h5" component="div" sx={{ textAlign: 'center', color: '#0097b2' }}>
            Customise {item.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'purple',
                  p: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', maxWidth: '300px', marginBottom: '16px' }} />
                <Typography variant="h6" component="div" sx={{ color: '#ffffff', marginBottom: '8px' }}>
                  {item.name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#ffffff' }}>
                  From ${item.price}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: '#e0e0e0',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                {/* Placeholder for customization options */}
                Customisation Options
                {/* Add your customization logic here (e.g., buttons to add/remove toppings) */}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToCart} sx={{ color: '#ffffff', backgroundColor: '#0097b2', '&:hover': { backgroundColor: '#0097b2' } }}>
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default FeaturedItem;