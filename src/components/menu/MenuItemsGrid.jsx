import React from 'react';
import { Box, Typography, Chip, Grid, Fade } from '@mui/material';
import MenuItem from '../../components/menu-browsing/MenuItem';
import NoResultsFound from './NoResultsFound';

const MenuItemsGrid = ({ displayedItems, selectedCategory, categories, searchTerm, setSearchTerm, clearFilters, isMobile = false }) => (
  <>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: isMobile ? 2 : 3
    }}>
      <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
        {selectedCategory 
          ? `${categories.find(c => c._id === selectedCategory)?.name || 'Category'}` 
          : 'All Menu Items'} 
        <Typography component="span" sx={{ ml: 1, fontWeight: 'normal', color: 'text.secondary' }}>
          ({displayedItems?.length} items)
        </Typography>
      </Typography>
      
      {searchTerm && (
        <Chip 
          label={isMobile ? `"${searchTerm}"` : `Search: "${searchTerm}"`}
          onDelete={() => setSearchTerm('')}
          size={isMobile ? "small" : "medium"}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
    
    <Grid container spacing={3}>
      {displayedItems?.map((item, index) => (
        <Fade
          in={true}
          key={item._id}
          style={{ transitionDelay: `${isMobile ? 40 * (index % 4) : 50 * (index % 6)}ms` }}
        >
          <Grid item xs={12} sm={isMobile ? 12 : 6}>
            <MenuItem item={item} />
          </Grid>
        </Fade>
      ))}
    </Grid>
    
    {displayedItems?.length === 0 && (
      <NoResultsFound 
        clearFilters={clearFilters}
        isMobile={isMobile}
      />
    )}
  </>
);

export default MenuItemsGrid;
