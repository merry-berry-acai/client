import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm, variant = "default" }) => {
  const isBanner = variant === "banner";
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <Box sx={{ mt: isBanner ? 4 : 0, maxWidth: isBanner ? 500 : "100%" }}>
      <TextField
        fullWidth
        placeholder={isBanner ? "Search for items by name or ingredients..." : "Search menu items..."}
        value={searchTerm}
        onChange={handleSearchChange}
        size={isBanner ? "medium" : "small"}
        inputProps={{ 'aria-label': 'Search menu items' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch color={isBanner ? "white" : "#8a2be2"} />
            </InputAdornment>
          ),
          sx: isBanner ? {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          } : {}
        }}
        sx={{
          '& .MuiInputBase-input::placeholder': isBanner ? {
            color: 'rgba(255, 255, 255, 0.7)',
            opacity: 1,
          } : {},
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#8a2be2',
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
