import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Drawer
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';

const DebugPanel = ({ componentName, props = {}, state = {}, contextData = {}, showByDefault = false }) => {
  const [isOpen, setIsOpen] = useState(showByDefault);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  
  // Use ref to track render count without causing re-renders
  const renderCountRef = useRef(0);
  // Update display count state only when needed
  const [displayRenderCount, setDisplayRenderCount] = useState(0);
  
  // Increment render count on each render
  renderCountRef.current += 1;
  
  // Update the displayed count only when panel is opened or refreshed
  useEffect(() => {
    if (isOpen) {
      setDisplayRenderCount(renderCountRef.current);
    }
  }, [isOpen]);
  
  // Only render in development environment
  if (import.meta.env.VITE_NODE_ENV !== 'development') {
    return null;
  }

  const handleCopy = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRefresh = () => {
    setDisplayRenderCount(renderCountRef.current);
  };

  const tabs = [
    { label: "Props", data: props },
    { label: "Context", data: contextData },
    { label: "Route", data: { pathname: location.pathname, search: location.search, hash: location.hash } }
  ];

  const renderTabContent = () => {
    const currentData = tabs[activeTab].data;
    
    return (
      <Box sx={{ position: 'relative', mt: 1 }}>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <Tooltip title="Copy to clipboard">
            <IconButton 
              size="small" 
              onClick={() => handleCopy(currentData)}
              sx={{ color: copied ? 'success.main' : 'primary.light' }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box 
          sx={{ 
            backgroundColor: '#1e1e2e', 
            p: 2, 
            borderRadius: 1,
            maxHeight: '50vh',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}
        >
          {Object.keys(currentData).length === 0 ? (
            <Typography sx={{ color: '#888', fontStyle: 'italic' }}>
              No data available
            </Typography>
          ) : (
            <pre style={{ margin: 0, overflowX: 'auto' }}>
              {JSON.stringify(currentData, null, 2)}
            </pre>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: 400 },
            backgroundColor: '#282a36',
            color: '#f8f8f2',
            borderLeft: '1px solid #44475a'
          }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8be9fd' }}>
              {componentName}
              <Chip 
                size="small" 
                label={`Renders: ${displayRenderCount}`} 
                sx={{ ml: 1, bgcolor: '#44475a', color: '#f8f8f2', height: 20 }} 
              /> 
            </Typography>
            
            <Box>
              <Tooltip title="Update render count">
                <IconButton size="small" sx={{ color: '#bd93f9', mr: 1 }} onClick={handleRefresh}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <IconButton size="small" sx={{ color: '#ff79c6' }} onClick={() => setIsOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ 
              mb: 2, 
              borderBottom: 1, 
              borderColor: '#44475a',
              '& .MuiTab-root': { color: '#bd93f9' },
              '& .Mui-selected': { color: '#ff79c6' },
              '& .MuiTabs-indicator': { backgroundColor: '#ff79c6' }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label} 
                sx={{ textTransform: 'none' }}
              />
            ))}
          </Tabs>
          
          {renderTabContent()}
          
          <Typography 
            variant="caption" 
            sx={{ mt: 'auto', pt: 2, color: '#6272a4', textAlign: 'center' }}
          >
            Debug panel active · Development mode · {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Drawer>
      
      <Button
        variant="contained"
        size="small"
        startIcon={<BugReportIcon />}
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9000,
          bgcolor: '#bd93f9',
          color: '#282a36',
          '&:hover': { bgcolor: '#ff79c6' },
        }}
      >
        Debug
      </Button>
    </>
  );
};

export default DebugPanel;
