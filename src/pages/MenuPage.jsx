import React, { useState, useContext } from 'react';
import { Container, Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuContext } from '../contexts/MenuContext';
import Layout from '../components/Layout';
import DebugPanel from '../components/DebugPanel';
import EducatorNote from '../components/EducatorNote';
import { 
  MenuPageHeader, 
  CategorySidebar, 
  MobileCategorySelector, 
  MenuItemsGrid 
} from '../components/menu';

const MenuPage = () => {
  const { menuItems, categories } = useContext(MenuContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!menuItems?.length) {
    return <Typography>Loading menu items...</Typography>;
  }
  if (!categories?.length) {
    return <Typography>Loading categories...</Typography>;
  }

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  

  // Filter by category and search term
  const filteredItems = menuItems?.filter(item => {
    // Category filter
    const matchesCategory = selectedCategory ? item?.category === selectedCategory : true;
    
    // Search filter
    const matchesSearch = searchTerm 
      ? item?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) || 
        item?.description?.toLowerCase().includes(searchTerm?.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  const sortItems = (items) => {
    if (!items?.length) return [];
    
    switch (sortBy) {
      case 'price-low':
        return [...items].sort((a, b) => a?.basePrice - b?.basePrice);
      case 'price-high':
        return [...items].sort((a, b) => b?.basePrice - a?.basePrice);
      case 'name-asc':
        return [...items].sort((a, b) => a?.name?.localeCompare(b?.name || ''));
      case 'name-desc':
        return [...items].sort((a, b) => b?.name?.localeCompare(a?.name || ''));
      default:
        return items;
    }
  };

  const displayedItems = sortItems(filteredItems);

  return (
    <Layout>
      <MenuPageHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        isDesktop={isDesktop} 
      />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Our Menu
        </Typography>
        
        {/* Educator Note */}
        <EducatorNote sx={{ mb: 3 }} hideOnMobile={true}>
          <Typography variant="body2">
            This menu page demonstrates data fetching from an API with loading states, filtering, 
            and adding items to cart. Notice how the MenuContext is used to manage category filters 
            and product data across components.
          </Typography>
        </EducatorNote>
        
        <Box sx={{ py: 4 }}>
          {isDesktop ? (
            // Desktop 2-column layout
            <Grid container spacing={4}>
              {/* Left sidebar with categories */}
              <Grid item md={3}>
                <CategorySidebar 
                  selectedCategory={selectedCategory}
                  handleSelectCategory={handleSelectCategory}
                  menuItems={menuItems}
                  categories={categories}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </Grid>
              
              {/* Right content area with menu items */}
              <Grid item md={9}>
                <MenuItemsGrid 
                  displayedItems={displayedItems}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  clearFilters={clearAllFilters}
                />
              </Grid>
            </Grid>
          ) : (
            // Mobile single-column layout
            <>
              <MobileCategorySelector 
                selectedCategory={selectedCategory}
                handleSelectCategory={handleSelectCategory}
                menuItems={menuItems}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              
              <MenuItemsGrid 
                displayedItems={displayedItems}
                selectedCategory={selectedCategory}
                categories={categories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                clearFilters={clearAllFilters}
                isMobile={true}
              />
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
          searchTerm,
          menuItemsCount: menuItems?.length,
          categoriesCount: categories?.length,
          filteredItems: displayedItems?.length
        }}
      />
    </Layout>
  );
};

export default MenuPage;