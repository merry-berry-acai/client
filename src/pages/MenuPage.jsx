import React, { useState, useContext } from 'react';
import { 
  Container, Box, Typography, FormControl, InputLabel, Select, 
  MenuItem as MuiMenuItem, Grid, Divider, Paper, useMediaQuery, 
  Card, CardContent, List, ListItemButton, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuContext } from '../contexts/MenuContext';
import Layout from '../components/Layout';
import MenuItem from '../components/menu-browsing/MenuItem';
import DebugPanel from '../components/DebugPanel';

const MenuPage = () => {
  const { menuItems, categories } = useContext(MenuContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (menuItems.length === 0) {
    return <Typography>Loading menu items...</Typography>;
  }
  if (categories.length === 0) {
    return <Typography>Loading categories...</Typography>;
  }

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const filteredByCategory = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const sortItems = (items) => {
    switch (sortBy) {
      case 'price-low':
        return [...items].sort((a, b) => a.basePrice - b.basePrice);
      case 'price-high':
        return [...items].sort((a, b) => b.basePrice - a.basePrice);
      case 'name-asc':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...items].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return items;
    }
  };

  const displayedItems = sortItems(filteredByCategory);

  // Render the category sidebar for desktop view
  const CategorySidebar = () => (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Menu Categories</Typography>
      
      <List component="nav" sx={{ mb: 4 }}>
        <ListItemButton 
          selected={selectedCategory === null}
          onClick={() => handleSelectCategory(null)}
          sx={{
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
        </ListItemButton>
        
        {categories.map((category) => (
          <ListItemButton 
            key={category._id}
            selected={selectedCategory === category._id}
            onClick={() => handleSelectCategory(category._id)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
                color: '#8a2be2',
                '&:hover': {
                  backgroundColor: 'rgba(138, 43, 226, 0.15)',
                },
              },
            }}
          >
            <ListItemText primary={category.name} />
          </ListItemButton>
        ))}
      </List>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Sort Options</Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="sort-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortBy}
          label="Sort By"
          onChange={(e) => setSortBy(e.target.value)}
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8a2be2',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8a2be2',
            }
          }}
        >
          <MuiMenuItem value="default">Featured</MuiMenuItem>
          <MuiMenuItem value="price-low">Price: Low to High</MuiMenuItem>
          <MuiMenuItem value="price-high">Price: High to Low</MuiMenuItem>
          <MuiMenuItem value="name-asc">Name: A to Z</MuiMenuItem>
          <MuiMenuItem value="name-desc">Name: Z to A</MuiMenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
  
  // Render horizontal category cards for mobile view
  const MobileCategorySelector = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        overflowX: 'auto', 
        pb: 1,
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '10px' }
      }}>
        <Card 
          variant="outlined" 
          sx={{ 
            minWidth: 120, 
            cursor: 'pointer',
            backgroundColor: selectedCategory === null ? 'rgba(138, 43, 226, 0.1)' : 'inherit',
            borderColor: selectedCategory === null ? '#8a2be2' : 'inherit'
          }}
          onClick={() => handleSelectCategory(null)}
        >
          <CardContent sx={{ py: 1, textAlign: 'center' }}>
            <Typography>All Items</Typography>
          </CardContent>
        </Card>
        
        {categories.map((category) => (
          <Card 
            key={category._id} 
            variant="outlined" 
            sx={{ 
              minWidth: 120, 
              cursor: 'pointer',
              backgroundColor: selectedCategory === category._id ? 'rgba(138, 43, 226, 0.1)' : 'inherit',
              borderColor: selectedCategory === category._id ? '#8a2be2' : 'inherit'
            }}
            onClick={() => handleSelectCategory(category._id)}
          >
            <CardContent sx={{ py: 1, textAlign: 'center' }}>
              <Typography>{category.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="mobile-sort-label">Sort By</InputLabel>
          <Select
            labelId="mobile-sort-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8a2be2',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8a2be2',
              }
            }}
          >
            <MuiMenuItem value="default">Featured</MuiMenuItem>
            <MuiMenuItem value="price-low">Price: Low to High</MuiMenuItem>
            <MuiMenuItem value="price-high">Price: High to Low</MuiMenuItem>
            <MuiMenuItem value="name-asc">Name: A to Z</MuiMenuItem>
            <MuiMenuItem value="name-desc">Name: Z to A</MuiMenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Our Menu
          </Typography>
          
          {isDesktop ? (
            // Desktop 2-column layout
            <Grid container spacing={4}>
              {/* Left sidebar with categories */}
              <Grid item md={3}>
                <CategorySidebar />
              </Grid>
              
              {/* Right content area with menu items */}
              <Grid item md={9}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedCategory 
                    ? `${categories.find(c => c._id === selectedCategory)?.name || 'Category'} Items` 
                    : 'All Menu Items'} 
                  <Typography component="span" sx={{ fontWeight: 'normal' }}>
                    ({displayedItems.length} items)
                  </Typography>
                </Typography>
                
                <Grid container spacing={3}>
                  {displayedItems.map(item => (
                    <Grid item xs={12} sm={6} key={item._id}>
                      <MenuItem item={item} />
                    </Grid>
                  ))}
                </Grid>
                
                {displayedItems.length === 0 && (
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography>No items found in this category.</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          ) : (
            // Mobile single-column layout
            <>
              <MobileCategorySelector />
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedCategory 
                  ? `${categories.find(c => c._id === selectedCategory)?.name || 'Category'} Items` 
                  : 'All Menu Items'} 
                ({displayedItems.length})
              </Typography>
              
              <Grid container spacing={3}>
                {displayedItems.map(item => (
                  <Grid item xs={12} key={item._id}>
                    <MenuItem item={item} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Container>
      <DebugPanel 
        componentName="MenuPage" 
        props={{ isDesktop }} 
        contextData={{ 
          selectedCategory, 
          sortBy, 
          menuItemsCount: menuItems?.length,
          categoriesCount: categories?.length,
          filteredItems: displayedItems?.length
        }}
      />
    </Layout>
  );
};

export default MenuPage;