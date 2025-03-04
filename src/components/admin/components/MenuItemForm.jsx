import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box,
  CircularProgress, InputAdornment, FormControlLabel, Switch
} from '@mui/material';
import ImageUploader from './ImageUploader';

const MenuItemForm = ({
  open, 
  onClose, 
  formMode, 
  formData, 
  onInputChange, 
  onSubmit, 
  loading, 
  categories,
  imagePreview,
  imageFile,
  onImageChange,
  onClearImage
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {formMode === 'create' ? 'Create New Menu Item' : 'Edit Menu Item'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
              margin="dense"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              multiline
              rows={3}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Detailed Description"
              name="details"
              value={formData.details}
              onChange={onInputChange}
              multiline
              rows={2}
              margin="dense"
              placeholder="Additional details about the product"
            />
            <TextField
              fullWidth
              label="Price"
              name="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={onInputChange}
              required
              margin="dense"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={onInputChange}
                label="Category"
              >
                {categories && categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageUploader 
              imagePreview={imagePreview}
              imageUrl={formData.image}
              onImageChange={onImageChange}
              onInputChange={onInputChange}
              onClearImage={onClearImage}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Status Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={onInputChange}
                    name="isAvailable"
                    color="success"
                  />
                }
                label="Available for Purchase"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={onInputChange}
                    name="isFeatured"
                    color="primary"
                  />
                }
                label="Featured on Homepage"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: 'purple',
            '&:hover': { bgcolor: 'darkviolet' }
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : formMode === 'create' ? (
            'Create Item'
          ) : (
            'Update Item'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemForm;
