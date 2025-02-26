import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Fab, 
  Collapse, 
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';

const DebugPanel = ({ componentName, props = {}, contextData = {} }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const togglePanel = () => {
    setOpen(!open);
  };
  
  // Only render in development environment
  if (import.meta.env.VITE_NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Floating button to toggle debug panel */}
      <Fab
        color="default"
        size="small"
        onClick={togglePanel}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          bgcolor: open ? 'error.main' : 'grey.300',
          color: open ? 'white' : 'text.primary',
        }}
      >
        <BugReportIcon />
      </Fab>
      
      {/* Collapsible debug panel */}
      <Collapse in={open}>
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 300,
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 1200,
            p: 2,
            opacity: 0.9,
            backgroundColor: '#1e1e1e',
            color: 'white',
            border: '1px solid #444',
          }}
        >
          <Typography variant="h6" sx={{ color: '#61dafb', fontFamily: 'monospace' }}>
            Debug: {componentName}
          </Typography>
          
          <Divider sx={{ my: 1, borderColor: '#444' }} />
          
          <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontFamily: 'monospace' }}>
            Route:
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.8rem' }}
          >
            {location.pathname}
          </Typography>
          
          <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontFamily: 'monospace' }}>
            Props:
          </Typography>
          <Box sx={{ mb: 2, backgroundColor: '#2d2d2d', p: 1, borderRadius: 1 }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', overflowX: 'auto' }}>
              {JSON.stringify(props, null, 2)}
            </pre>
          </Box>
          
          <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontFamily: 'monospace' }}>
            Context Data:
          </Typography>
          <Box sx={{ backgroundColor: '#2d2d2d', p: 1, borderRadius: 1 }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', overflowX: 'auto' }}>
              {JSON.stringify(contextData, null, 2)}
            </pre>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default DebugPanel;
