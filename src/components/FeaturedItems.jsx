import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function FeaturedItem({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [customOption, setCustomOption] = useState("");

  const addToCart = () => {
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
        <DialogTitle>Customize {item.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Customization Option</InputLabel>
            <Select
              value={customOption}
              label="Customization Option"
              onChange={(e) => setCustomOption(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Option 1">Option 1</MenuItem>
              <MenuItem value="Option 2">Option 2</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">Cancel</Button>
          <Button onClick={addToCart} variant="contained" color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default FeaturedItem;