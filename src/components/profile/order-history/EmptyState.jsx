import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">No orders yet</Typography>
      <Button 
        variant="contained" 
        sx={{ 
          mt: 2,
          bgcolor: 'purple',
          '&:hover': { bgcolor: 'darkviolet' }
        }}
        onClick={() => navigate('/menu')}
      >
        Browse Menu
      </Button>
    </Box>
  );
};

export default EmptyState;
