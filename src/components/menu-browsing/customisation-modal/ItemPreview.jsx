import React from 'react';
import { Paper, Box, Typography, Divider, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AppImage from '../../common/AppImage';

const ItemPreview = ({ item, basePrice, quantity, incrementQuantity, decrementQuantity }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{
          width: '100%',
          height: 180,
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5'
        }}
      >
        <AppImage
          src={item.imageUrl}
          alt={item.name}
          fallbackSrc="/assets/default-food.png"
          sx={{
            width: '100%',
            height: 180,
            borderRadius: 2
          }}
        />
      </Box>
      
      <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 1 }}>
        {item.name}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={2}>
        {item.details}
      </Typography>
      
      <Divider sx={{ width: '100%', my: 2 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="subtitle1">Base price:</Typography>
        <Typography variant="subtitle1" fontWeight="medium">${parseFloat(basePrice).toFixed(2)}</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: 2 }}>
        <Typography variant="subtitle2" mb={1}>Quantity:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button 
            variant="outlined"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            sx={{ 
              minWidth: '40px',
              height: '40px',
              borderRadius: '50%',
              p: 0,
              color: '#8a2be2',
              borderColor: '#8a2be2',
              '&:hover': {
                borderColor: '#6a1fb1',
                backgroundColor: 'rgba(138, 43, 226, 0.08)'
              }
            }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Typography variant="h6" sx={{ mx: 2, minWidth: '30px', textAlign: 'center' }}>
            {quantity}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={incrementQuantity}
            sx={{ 
              minWidth: '40px',
              height: '40px',
              borderRadius: '50%',
              p: 0,
              color: '#8a2be2',
              borderColor: '#8a2be2',
              '&:hover': {
                borderColor: '#6a1fb1',
                backgroundColor: 'rgba(138, 43, 226, 0.08)'
              }
            }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ItemPreview;
