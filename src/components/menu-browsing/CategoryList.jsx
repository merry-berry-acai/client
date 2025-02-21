import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { getCategoriesWithItems } from '../../api/mockApi'; // adjust import as needed

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesWithItems().then(data => setCategories(data));
  }, []);

  return (
    <Box sx={{ 
      p: 2, 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: 2 
    }}>
      {categories.length === 0 ? (
        <Typography>Loading...</Typography>
      ) : (
        categories.map(category => (
          <Card 
            key={category.id} 
            variant="outlined" 
            sx={{ 
              boxShadow: 3, 
              cursor: 'pointer',
              backgroundColor: selectedCategory === category.id ? 'primary.light' : 'inherit'
            }}
            onClick={() => onSelectCategory(category.id)}
          >
            <CardContent sx={{ pt: 2, pb: 2 }}>
              <Typography variant="h6">{category.name}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CategoryList;