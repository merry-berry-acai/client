import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * A standardized component for displaying educator notes throughout the application
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the note
 * @param {Object} props.sx - Additional styling to apply to the container
 * @param {string} props.title - Optional custom title (defaults to "Educator Note")
 * @param {boolean} props.hideOnMobile - Whether to hide the note on mobile screens
 */
const EducatorNote = ({ 
  children, 
  sx = {}, 
  title = "Educator Note",
  hideOnMobile = false
}) => {
  return (
    <Box 
      sx={{ 
        p: 2,
        bgcolor: '#f8f9fa',
        border: '1px dashed #6a1fb1',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        display: hideOnMobile ? { xs: 'none', md: 'block' } : 'block',
        ...sx
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '5px', 
        height: '100%', 
        bgcolor: '#8a2be2' 
      }} />
      
      <Typography variant="h6" sx={{ color: '#6a1fb1', fontSize: '1rem', mb: 1, pl: 1 }}>
        📝 {title}
      </Typography>
      
      <Box sx={{ pl: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default EducatorNote;
