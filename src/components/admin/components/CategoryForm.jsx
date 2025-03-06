import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Grid, Typography, Box, CircularProgress, FormControlLabel, Switch
} from '@mui/material';
import ImageUploader from './ImageUploader';

const CategoryForm = ({
  open, 
  onClose, 
  formMode, 
  formData, 
  onInputChange, 
  onSubmit, 
  loading, 
  imagePreview,
  onImageChange,
  onClearImage
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {formMode === 'create' ? 'Create New Category' : 'Edit Category'}
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
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={onInputChange}
                    name="isActive"
                    color="success"
                  />
                }
                label="Active"
              />
            </Box>
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
              <Typography variant="body2" color="text.secondary">
                Categories can be used to organize your menu items. Add an image to make the category more appealing.
              </Typography>
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
            'Create Category'
          ) : (
            'Update Category'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
