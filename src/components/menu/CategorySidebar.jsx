import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemText, 
  Divider, 
  Box, 
  Chip, 
  Zoom 
} from '@mui/material';
import SortControl from './SortControl';
import { toTitleCase } from '../../utils/textFormatters';

const CategorySidebar = ({ 
  selectedCategory, 
  handleSelectCategory, 
  menuItems, 
  categories, 
  sortBy, 
  setSortBy 
}) => (
  <Paper elevation={2} sx={{ p: 3, height: '100%', position: 'sticky', top: '90px' }}>
    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#4a148c' }}>
      Menu Categories
    </Typography>
    <List component="nav" sx={{ mb: 4 }}>
      <ListItemButton
        role="button"
        aria-label="All Items"
        selected={selectedCategory === null}
        onClick={() => handleSelectCategory(null)}
        sx={{
          borderRadius: 1,
          mb: 1,
          '&.Mui-selected': {
            backgroundColor: 'rgba(138, 43, 226, 0.1)',
            color: '#8a2be2',
            '&:hover': {
              backgroundColor: 'rgba(138, 43, 226, 0.15)',
            },
          },
        }}
      >
        <ListItemText primary="All Items" />
        <Chip
          size="small"
          label={menuItems?.length}
          sx={{
            ml: 1,
            backgroundColor: selectedCategory === null ? '#8a2be2' : '#e0e0e0',
            color: selectedCategory === null ? 'white' : 'inherit'
          }}
        />
      </ListItemButton>
      
      {categories?.map((category) => {
        const categoryItemCount = menuItems.filter(item => item.category === category._id).length;
        return (
          <Zoom 
            in={true} 
            key={category._id} 
            style={{ transitionDelay: `${50 * categories.indexOf(category)}ms` }}
          >
            <ListItemButton
              role="button"
              aria-label={toTitleCase(category.name)}
              selected={selectedCategory === category._id}
              onClick={() => handleSelectCategory(category._id)}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(138, 43, 226, 0.1)',
                  color: '#8a2be2',
                  '&:hover': {
                    backgroundColor: 'rgba(138, 43, 226, 0.15)',
                  },
                },
              }}
            >
              <ListItemText primary={toTitleCase(category.name)} />
              <Chip
                size="small"
                label={categoryItemCount}
                sx={{
                  ml: 1,
                  backgroundColor: selectedCategory === category._id ? '#8a2be2' : '#e0e0e0',
                  color: selectedCategory === category._id ? 'white' : 'inherit'
                }}
              />
            </ListItemButton>
          </Zoom>
        );
      })}
    </List>
    
    <Divider sx={{ mb: 3 }} />
    <SortControl sortBy={sortBy} setSortBy={setSortBy} />
    
    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        This menu is part of a school project for Coder Academy.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        All items are for demonstration purposes only.
      </Typography>
    </Box>
  </Paper>
);

export default CategorySidebar;