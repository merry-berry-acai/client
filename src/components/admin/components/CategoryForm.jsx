import React from 'react';
import {
  TextField,
  Grid, Typography, Box, FormControlLabel, Switch,
} from '@mui/material';
import ImageUploader from './ImageUploader';
import BaseForm from '../../common/BaseForm';

const CategoryForm = ({
  open,
  onClose,
  formMode,
  formData,
  onInputChange,
  onSubmit,
  imagePreview,
  onImageChange,
  onClearImage,
}) => {
  return (
    <BaseForm
      open={open}
      onClose={onClose}
      formMode={formMode}
      title={formMode === 'create' ? 'Create New Category' : 'Edit Category'}
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
        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={onInputChange}
                name="isActive"
                color="success"
                disabled={false}
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
          loading={false}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Categories can be used to organize your menu items. Add an image to make the category more appealing.
          </Typography>
        </Box>
      </Grid>
    </BaseForm>
  );
};

export default CategoryForm;
