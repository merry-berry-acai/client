import React from 'react';
import Layout from '../components/Layout';
import useApiStatus from '../hooks/useApiStatus';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  Divider, 
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  CheckCircle, 
  Error as ErrorIcon, 
  Refresh,
  AccessTime,
  Timeline,
  History
} from '@mui/icons-material';

const StatusPage = () => {
  const { 
    isUp, 
    responseTime, 
    lastChecked, 
    error, 
    history, 
    isLoading, 
    refresh 
  } = useApiStatus(15000); // Check every 15 seconds

  // Format the timestamp to be more readable
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Status
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              {isLoading ? (
                <CircularProgress size={24} sx={{ mr: 2 }} />
              ) : isUp ? (
                <CheckCircle color="success" sx={{ fontSize: 32, mr: 2 }} />
              ) : (
                <ErrorIcon color="error" sx={{ fontSize: 32, mr: 2 }} />
              )}
              
              <Box>
                <Typography variant="h6">
                  API Status: {isLoading ? 'Checking...' : (isUp ? 'Online' : 'Offline')}
                </Typography>
                {!isLoading && !isUp && error && (
                  <Typography variant="body2" color="error">
                    Error: {error}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Button 
              variant="outlined" 
              startIcon={<Refresh />} 
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="space-between">
            <Card sx={{ minWidth: 200, flex: 1 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccessTime color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Checked
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {formatTime(lastChecked)}
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200, flex: 1 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Timeline color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Response Time
                  </Typography>
                </Box>
                <Typography variant="h6">
                  {responseTime ? `${responseTime}ms` : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
        
        {history.length > 0 && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <History color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Status History</Typography>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Response Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...history].reverse().map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTime(item.lastChecked)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={item.isUp ? <CheckCircle /> : <ErrorIcon />}
                          label={item.isUp ? "Online" : "Offline"}
                          color={item.isUp ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.responseTime ? `${item.responseTime}ms` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Layout>
  );
};

export default StatusPage;
