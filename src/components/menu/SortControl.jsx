import React from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SortControl = ({ sortBy, setSortBy, fullWidth = true }) => (
  <>
    <Typography variant="subtitle1" sx={{ mb: 2, color: '#4a148c' }}>Sort Options</Typography>
    <FormControl fullWidth={fullWidth} size="small">
      <InputLabel id="sort-select-label">Sort By</InputLabel>
      <Select
        labelId="sort-select-label"
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
        <MenuItem value="default">Featured</MenuItem>
        <MenuItem value="price-low">Price: Low to High</MenuItem>
        <MenuItem value="price-high">Price: High to Low</MenuItem>
        <MenuItem value="name-asc">Name: A to Z</MenuItem>
        <MenuItem value="name-desc">Name: Z to A</MenuItem>
      </Select>
    </FormControl>
  </>
);

export default SortControl;
