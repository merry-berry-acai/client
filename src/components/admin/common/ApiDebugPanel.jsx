import React from 'react';
import {
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Button,
  Card,
  FormControlLabel,
  Switch,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import { createContext, useContext } from 'react';

// Create a context for the debug logger
export const ApiDebugContext = createContext({
  logApiRequest: () => {},
  debugMode: false,
  toggleDebugMode: () => {},
  apiLogs: [],
  clearApiLogs: () => {},
});

export const useApiDebug = () => useContext(ApiDebugContext);

// Updated ApiDebugPanel to use the context instead of managing its own state
const ApiDebugPanel = () => {
  // Get everything directly from context
  const { debugMode, toggleDebugMode, apiLogs, clearApiLogs } = useApiDebug();
  
  return (
    <>
      <Tooltip title="Toggle Debug Mode">
        <FormControlLabel
          control={
            <Switch
              checked={debugMode}
              onChange={(e) => toggleDebugMode(e.target.checked)}
              color="secondary"
              size="small"
            />
          }
          label={
            <Box display="flex" alignItems="center">
              <BugReportIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">Debug</Typography>
            </Box>
          }
        />
      </Tooltip>
      
      {debugMode && (
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight="bold">
                <BugReportIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                API Debug Panel
              </Typography>
              <Button size="small" onClick={clearApiLogs} color="secondary" sx={{ mr: 2 }}>
                Clear Logs
              </Button>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {apiLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No API requests logged yet. Actions will appear here.
              </Typography>
            ) : (
              apiLogs.map(log => (
                <Card key={log.id} variant="outlined" sx={{ mb: 2, bgcolor: log.success ? 'background.paper' : '#fff8f8' }}>
                  <Box sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle2" color={log.success ? 'primary' : 'error'}>
                        {log.requestType} {log.url}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    
                    {log.data && (
                      <>
                        <Typography variant="caption" color="text.secondary">Request Payload:</Typography>
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: 100,
                            fontSize: '0.75rem',
                            mb: 1
                          }}
                        >
                          {JSON.stringify(log.data, null, 2)}
                        </Box>
                      </>
                    )}
                    
                    {log.response && (
                      <>
                        <Typography variant="caption" color="text.secondary">Response:</Typography>
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: 100,
                            fontSize: '0.75rem'
                          }}
                        >
                          {JSON.stringify(log.response, null, 2)}
                        </Box>
                      </>
                    )}
                    
                    {log.error && (
                      <>
                        <Typography variant="caption" color="error">Error:</Typography>
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: '#ffebee',
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            color: 'error.main',
                            maxHeight: 100,
                            fontSize: '0.75rem'
                          }}
                        >
                          {log.error}
                        </Box>
                      </>
                    )}
                  </Box>
                </Card>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default ApiDebugPanel;
