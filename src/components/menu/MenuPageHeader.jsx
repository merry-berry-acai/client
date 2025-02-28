import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SearchBar from './SearchBar';
import MenuQuickFilters from './MenuQuickFilters';

const MenuPageHeader = ({ searchTerm, setSearchTerm, isDesktop }) => (
  <Box 
    sx={{ 
      backgroundColor: '#4a148c',
      pt: { xs: 6, md: 8 },
      pb: { xs: 6, md: 8 },
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Container maxWidth="xl">
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'radial-gradient(circle at top right, rgba(186, 104, 200, 0.4), rgba(74, 20, 140, 0) 70%)',
          zIndex: 1
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1
          }}
        >
          Our Menu
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, fontWeight: 300, opacity: 0.9 }}>
          Explore our delicious selection of freshly crafted items
        </Typography>
        
        {isDesktop && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} variant="banner" />}
        
        <MenuQuickFilters />
      </Box>
    </Container>
  </Box>
);

export default MenuPageHeader;
