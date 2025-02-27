
import React from 'react';
import { Box, Typography, Collapse } from '@mui/material';

const DebugPanel = ({ showDebug, debugData }) => {
  return (
    <Collapse in={showDebug}>
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px dashed #ccc' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Debug Information:</Typography>
        <Box component="pre" sx={{ 
          fontSize: '0.75rem', 
          p: 1, 
          bgcolor: '#2d2d2d', 
          color: '#e0e0e0',
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: 150
        }}>
          {JSON.stringify(debugData, null, 2)}
        </Box>
      </Box>
    </Collapse>
  );
};

export default DebugPanel;