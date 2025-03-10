import React from 'react';
import {
  TextField,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box,
  InputAdornment, FormControlLabel, Switch
} from '@mui/material';
import ImageUploader from './ImageUploader';
import BaseForm from '../../common/BaseForm';

const MenuItemForm = ({
  open,
  onClose,
  formMode,
  formData,
  onInputChange,
  onSubmit,
  categories,
  imagePreview,
  imageFile,
  onImageChange,
  onClearImage,
}) => {
  const isEdit = formMode === 'create';

  return (
    <BaseForm
      open={open}
      onClose={onClose}
      title={formMode === 'create' ? 'Create New Menu Item' : 'Edit Menu Item'}
      isEdit={isEdit}
      onSubmit={onSubmit}
    >
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          margin="dense"
          disabled={false}
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
          disabled={false}
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
          disabled={false}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={onInputChange}
            label="Category"
            disabled={false}
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
          loading={false}
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
                disabled={false}
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
                disabled={false}
              />
            }
            label="Featured on Homepage"
          />
        </Box>
      </Grid>
    </BaseForm>
  );
};

export default MenuItemForm;
