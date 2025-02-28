import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { getCategories } from '../../api/apiHandler'; // updated import

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(data => setCategories(data));
  }, []);

  // Display error if API failed
  if (categories === null) {
    return <Typography>Error loading categories.</Typography>;
  }

  return (
    <Box sx={{ 
      p: 2, 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: 2 
    }}>
      {!categories?.length ? (
        <Typography>Loading...</Typography>
      ) : (
        categories.map(category => (
          <Card 
            key={category?._id} 
            variant="outlined" 
            sx={{ 
              boxShadow: 3, 
              cursor: 'pointer',
              backgroundColor: selectedCategory === category?._id ? 'rgba(138, 43, 226, 0.1)' : 'inherit',
              borderColor: selectedCategory === category?._id ? '#8a2be2' : 'inherit',
              borderWidth: selectedCategory === category?._id ? 2 : 1
            }}
            onClick={() => onSelectCategory(category?._id)}
          >
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6">{category?.name}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CategoryList;