import React, { useState, useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip, Divider } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ImageIcon from '@mui/icons-material/Image';
import CustomisationModal from './CustomisationModal';
import { CartContext } from '../../contexts/CartContext';

const MenuItem = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (selectedToppings, quantity) => {
    addToCart(item, selectedToppings, quantity);
    setShowModal(false);
  };

  // Try to use the item's image URL, falling back to error handling if it doesn't load
  const imageURL = item.imageURL || item.image;

  return (
    <Card 
      elevation={isHovered ? 4 : 1} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        '&:hover': { 
          borderColor: '#8a2be2',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ position: 'relative', height: 220 }}>
        {imageURL && !imageError ? (
          <CardMedia
            component="img"
            image={imageURL}
            alt={item.name}
            sx={{ 
              height: '100%',
              objectFit: 'cover',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box 
            sx={{ 
              height: '100%',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              bgcolor: '#f5f5f5',
              color: '#9e9e9e'
            }}
          >
            <ImageIcon sx={{ fontSize: 60, mb: 1, opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {item.name}
            </Typography>
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ 
          fontSize: '1.3rem', 
          fontWeight: 'bold', 
          mb: 1,
          color: '#212121'
        }}>
          {item.name}
        </Typography>
        
        <Typography variant="body2" sx={{ 
          color: 'text.secondary',
          mb: 2,
          flexGrow: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {item.description}
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1
        }}>
          <Typography variant="h6" sx={{ 
            color: '#8a2be2', 
            fontWeight: 'bold',
            fontSize: '1.4rem'
          }}>
            ${parseFloat(item.basePrice).toFixed(2)}
          </Typography>
          
          <Button 
            onClick={() => setShowModal(true)} 
            variant="contained" 
            startIcon={<AddShoppingCartIcon />}
            sx={{
              backgroundColor: '#8a2be2',
              borderRadius: '50px',
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: '#6a1fb1',
                boxShadow: '0 4px 12px rgba(138, 43, 226, 0.25)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
      
      <CustomisationModal 
        key={item._id} 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={handleAddToCart} 
        item={item} 
      />
    </Card>
  );
};

export default MenuItem;
