import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Box, Typography, Skeleton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import AppImage from '../../common/AppImage';

const MenuItemTable = ({ 
  menuItems, 
  onEdit, 
  onDelete, 
  getCategoryName 
}) => {
  // Function to render the image with proper error handling
  const renderItemImage = (item) => {
    if (!item.imageUrl) {
      return (
        <Box sx={{ 
          width: 50, 
          height: 50, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: '#f0f0f0', 
          borderRadius: 1 
        }}>
          <ImageIcon color="disabled" />
        </Box>
      );
    }

    return (
      <AppImage
        src={item.imageUrl}
        alt={item.name || 'Menu item'}
        sx={{ 
          width: 50, 
          height: 50, 
          objectFit: 'cover', 
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          aspectRatio: '1/1'
        }}
      />
    );
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!menuItems || menuItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">No menu items found. Create your first item!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            menuItems.map((item) => (
              <TableRow key={item._id} hover>
                <TableCell>{renderItemImage(item)}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography noWrap>{item.description}</Typography>
                </TableCell>
                <TableCell>${parseFloat(item.basePrice).toFixed(2)}</TableCell>
                <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                <TableCell>
                  {item.isAvailable !== false ? (
                    <Box sx={{ 
                      bgcolor: 'rgba(46, 125, 50, 0.1)',
                      color: 'rgb(46, 125, 50)',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      Available
                    </Box>
                  ) : (
                    <Box sx={{ 
                      bgcolor: 'rgba(211, 47, 47, 0.1)',
                      color: 'rgb(211, 47, 47)',
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      Unavailable
                    </Box>
                  )}
                  {item.isFeatured && (
                    <Box sx={{ 
                      bgcolor: 'rgba(123, 31, 162, 0.1)',
                      color: 'rgb(123, 31, 162)',
                      py: 0.5,
                      px: 1,
                      ml: 1,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      Featured
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => onEdit(item)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => onDelete(item)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MenuItemTable;
