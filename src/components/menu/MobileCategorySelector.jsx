import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import SearchBar from './SearchBar';
import SortControl from './SortControl';
// Import the utility function
import { toTitleCase } from '../../utils/textFormatters';

const MobileCategorySelector = ({ selectedCategory, handleSelectCategory, menuItems, categories, sortBy, setSortBy, searchTerm, setSearchTerm }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ mb: 3 }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </Box>
    
    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
      <FaFilter style={{ marginRight: '8px' }} /> Categories
    </Typography>
    
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
          <Typography fontWeight={selectedCategory === null ? 600 : 400}>
            All Items
            <Box component="span" sx={{ display: 'block', fontSize: '0.8rem', color: 'text.secondary' }}>
              {menuItems?.length || 0} items
            </Box>
          </Typography>
        </CardContent>
      </Card>
      
      {categories?.map((category) => {
        const categoryItemCount = menuItems?.filter(item => item?.category === category?._id)?.length || 0;
        return (
          <Card 
            key={category?._id} 
            variant="outlined" 
            sx={{ 
              minWidth: 120, 
              cursor: 'pointer',
              backgroundColor: selectedCategory === category?._id ? 'rgba(138, 43, 226, 0.1)' : 'inherit',
              borderColor: selectedCategory === category?._id ? '#8a2be2' : 'inherit'
            }}
            onClick={() => handleSelectCategory(category?._id)}
          >
            <CardContent sx={{ py: 1, textAlign: 'center' }}>
              <Typography fontWeight={selectedCategory === category?._id ? 600 : 400}>
                {toTitleCase(category?.name)}
                <Box component="span" sx={{ display: 'block', fontSize: '0.8rem', color: 'text.secondary' }}>
                  {categoryItemCount} items
                </Box>
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
    
    <Box sx={{ mt: 3, mb: 2 }}>
      <SortControl sortBy={sortBy} setSortBy={setSortBy} />
    </Box>
  </Box>
);

export default MobileCategorySelector;
