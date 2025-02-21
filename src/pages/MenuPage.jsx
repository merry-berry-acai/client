import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { getMenuItems, CATEGORIES } from '../api/mockApi';
import CategoryList from '../components/menu-browsing/CategoryList';
import Layout from '../components/Layout';
import MenuItem from '../components/menu-browsing/MenuItem';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getMenuItems().then(data => setMenuItems(data));
  }, []);

  const handleSelectCategory = (categoryId) => {
    // toggle filter on repeated clicks
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const filteredItems = selectedCategory 
    ? menuItems.filter(item => {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        return cat && cat.items.includes(item.id);
      })
    : menuItems;

  return (
    <Layout>
      <Box className="max-w-4xl mx-auto">
        <Typography variant="h1" className="text-4xl font-bold mb-4">Menu</Typography>
        <CategoryList 
          onSelectCategory={handleSelectCategory} 
          selectedCategory={selectedCategory} 
        />
        <Box 
          component="ul" 
          sx={{ 
            mt: 4, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 2 
          }}
        >
          {menuItems.length === 0 ? (
            <Typography>Loading...</Typography>
          ) : (
            filteredItems.map(item => (
              // Replace inline Card with MenuItem component
              <MenuItem key={item.id} item={item} />
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default MenuPage;