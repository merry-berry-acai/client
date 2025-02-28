import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { FaStar, FaLeaf, FaHeart } from 'react-icons/fa';

const MenuQuickFilters = () => (
  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
    <Tooltip title="Customer favorites">
      <Chip 
        icon={<FaStar size={14} />}
        label="Popular"
        clickable
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      />
    </Tooltip>
    
    <Tooltip title="Vegetarian options">
      <Chip 
        icon={<FaLeaf size={14} />}
        label="Vegetarian"
        clickable
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      />
    </Tooltip>
    
    <Tooltip title="Staff recommendations">
      <Chip 
        icon={<FaHeart size={14} />}
        label="Staff Picks"
        clickable
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      />
    </Tooltip>
  </Box>
);

export default MenuQuickFilters;
