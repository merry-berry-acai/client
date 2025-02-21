import React, { useState, useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import CustomisationModal from './CustomisationModal';
import { CartContext } from '../../contexts/CartContext';

const MenuItem = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (selectedToppings) => {
    addToCart(item, selectedToppings);
    setShowModal(false);
  };

  return (
    <Card sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <CardMedia
        component="img"
        image={item.image}
        alt={item.name}
        sx={{ width: '100%', height: 200, objectFit: 'cover', mb: 2, borderRadius: 1 }}
      />
      <CardContent>
        <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 1 }}>
          {item.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {item.description}
        </Typography>
        <Typography variant="h3" sx={{ color: 'secondary.main', fontWeight: 'bold', mb: 2 }}>
          {item.price}
        </Typography>
        <Button onClick={() => setShowModal(true)} variant="contained" color="primary">
          Add to Cart
        </Button>
      </CardContent>
      <CustomisationModal open={showModal} onClose={() => setShowModal(false)} onAdd={handleAddToCart} item={item} />
    </Card>
  );
};

export default MenuItem;
