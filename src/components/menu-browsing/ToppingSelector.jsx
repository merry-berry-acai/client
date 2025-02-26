import React from 'react';
import { Box, Typography, Button, IconButton, Paper, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ToppingSelector = ({ topping, selected, onIncrement, onDecrement, isMaxReached, maxQuantity = 3 }) => {
  return (
    <Paper 
      elevation={selected ? 3 : 1}
      sx={{ 
        p: 1.5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        bgcolor: selected ? 'rgba(138, 43, 226, 0.08)' : 'white',
        border: selected ? '1px solid #8a2be2' : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 3,
        }
      }}
    >
      <Typography variant="subtitle2" fontWeight="medium">{topping.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>${topping.price.toFixed(2)}</Typography>
      
      {!selected ? (
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<AddIcon />}
          sx={{ 
            mt: 0.5, 
            borderRadius: 4,
            borderColor: '#8a2be2',
            color: '#8a2be2',
            '&:hover': {
              borderColor: '#8a2be2',
              bgcolor: 'rgba(138, 43, 226, 0.08)'
            }
          }} 
          onClick={() => onIncrement(topping)}
        >
          Add
        </Button>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, width: '100%' }}>
          <IconButton 
            size="small" 
            onClick={() => onDecrement(topping)}
            sx={{ 
              color: '#8a2be2', 
              bgcolor: 'rgba(138, 43, 226, 0.08)', 
              '&:hover': { bgcolor: 'rgba(138, 43, 226, 0.15)' } 
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          
          <Box sx={{ 
            mx: 2, 
            minWidth: '20px', 
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Typography variant="body2" fontWeight={isMaxReached ? 'bold' : 'normal'}>
              {selected.quantity}
            </Typography>
            {isMaxReached && (
              <Tooltip title={`Maximum ${maxQuantity} per topping`} arrow placement="top">
                <InfoOutlinedIcon 
                  sx={{ 
                    fontSize: 16, 
                    ml: 0.5, 
                    color: 'warning.main',
                    cursor: 'help'
                  }} 
                />
              </Tooltip>
            )}
          </Box>
          
          <IconButton 
            size="small" 
            onClick={() => onIncrement(topping)}
            disabled={isMaxReached}
            sx={{ 
              color: isMaxReached ? 'action.disabled' : '#8a2be2', 
              bgcolor: isMaxReached ? 'action.disabledBackground' : 'rgba(138, 43, 226, 0.08)', 
              '&:hover': { 
                bgcolor: isMaxReached ? 'action.disabledBackground' : 'rgba(138, 43, 226, 0.15)' 
              } 
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default ToppingSelector;
