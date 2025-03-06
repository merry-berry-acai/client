import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import AppImage from '../../common/AppImage';

const ImageUploader = ({ 
  imagePreview, 
  imageUrl, 
  onImageChange, 
  onInputChange, 
  onClearImage 
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Item Image
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 200,
          border: '1px dashed #ccc',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          overflow: 'hidden',
          bgcolor: '#f8f8f8',
        }}
      >
        {imagePreview || imageUrl ? (
          <AppImage
            src={imagePreview || imageUrl}
            alt="Preview"
            sx={{ 
              maxWidth: '100%', 
              maxHeight: '100%'
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No image selected
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          component="label"
          sx={{ mr: 1 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={onImageChange}
          />
        </Button>
        <TextField 
          label="Image URL"
          name="image"
          value={imageUrl}
          onChange={onInputChange}
          sx={{ flexGrow: 1 }}
          placeholder="Or enter image URL"
          size="small"
        />
      </Box>
      {(imagePreview || imageUrl) && (
        <Button
          variant="text"
          color="error"
          onClick={onClearImage}
          sx={{ mt: 1 }}
        >
          Clear Image
        </Button>
      )}
    </Box>
  );
};

export default ImageUploader;
