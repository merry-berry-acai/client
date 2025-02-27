import React from 'react';
import { DialogTitle, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';

const ModalHeader = ({ title, onClose, showDebug, setShowDebug, debugMode }) => {
  return (
    <DialogTitle sx={{ bgcolor: '#f8f8f8', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: '#8a2be2' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {debugMode && (
          <IconButton 
            onClick={() => setShowDebug(!showDebug)} 
            aria-label="debug" 
            size="small"
            color={showDebug ? "primary" : "default"}
            sx={{ mr: 1 }}
          >
            <BugReportIcon />
          </IconButton>
        )}
        <IconButton onClick={onClose} aria-label="close" size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  );
};

export default ModalHeader;
