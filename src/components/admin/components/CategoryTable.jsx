import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Box, Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!categories || categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">No categories found. Create your first category!</Typography>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category._id} hover>
                
                <TableCell>{category.name}</TableCell>
               
                <TableCell>
                  {category.isActive !== false ? (
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
                      Active
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
                      Inactive
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => onEdit(category)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => onDelete(category)}
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

export default CategoryTable;
