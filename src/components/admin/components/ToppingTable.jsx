import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Box, Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ToppingTable = ({ toppings, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Name</TableCell>
          
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!toppings?.length ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">No toppings found. Create your first topping!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            toppings.map((topping) => (
              <TableRow key={topping?._id} hover>
                <TableCell>{topping?.name}</TableCell>
                
                <TableCell>${parseFloat(topping?.price || 0).toFixed(2)}</TableCell>
                <TableCell>
                  {topping?.isAvailable !== false ? (
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
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => onEdit(topping)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => onDelete(topping)}
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

export default ToppingTable;
