import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const NoResultsFound = ({ clearFilters, isMobile = false }) => (
  <Box sx={{ mt: 4, textAlign: 'center', py: isMobile ? 5 : 6 }}>
    <Typography variant="h6" gutterBottom>No items found</Typography>
    <Typography color="text.secondary" variant={isMobile ? "body2" : "body1"} paragraph>
      Try adjusting your search or filter criteria
    </Typography>
    <Button 
      variant="outlined" 
      size={isMobile ? "small" : "medium"}
      onClick={clearFilters}
      sx={{
        mt: isMobile ? 1 : 2,
        borderColor: '#8a2be2',
        color: '#8a2be2',
        '&:hover': {
          borderColor: '#6a1fb1',
          backgroundColor: 'rgba(138, 43, 226, 0.08)'
        }
      }}
    >
      Clear Filters
    </Button>
  </Box>
);

export default NoResultsFound;
