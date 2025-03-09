import React, { Component } from 'react';
import Layout from './Layout';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Divider,
  Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error("ErrorBoundary caught an error", error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You could send this error to an error reporting service
    // this.logErrorToService(error, errorInfo);
  }

  // Optional: Add error reporting functionality
  logErrorToService(error, errorInfo) {
    // Implementation for your error reporting service
    // Example: Sentry, LogRocket, etc.
    Sentry.captureException(error, { extra: errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <Container maxWidth="md">
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                mt: 4, 
                borderRadius: 2,
                textAlign: 'center',
                borderTop: '4px solid #f44336'
              }}
            >
              <ErrorOutlineIcon 
                color="error" 
                sx={{ fontSize: 60, mb: 2 }} 
              />
              
              <Typography variant="h4" component="h1" gutterBottom>
                Something Went Wrong
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                We've encountered an unexpected error. This could be temporary, so you can try refreshing
                the page or return to the homepage.
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{ mt: 3, mb: 3 }}
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRefresh}
                >
                  Refresh Page
                </Button>
                
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/"
                  startIcon={<HomeIcon />}
                >
                  Go to Homepage
                </Button>
              </Stack>

              {/* Only show error details in development mode */}
              {import.meta.env.VITE_NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mt: 4, textAlign: 'left' }}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      ERROR DETAILS (DEVELOPMENT ONLY)
                    </Typography>
                  </Divider>
                  
                  <Typography variant="subtitle2" color="error" sx={{ mt: 1 }}>
                    {this.state.error.toString()}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: '#f5f5f5', 
                      borderRadius: 1,
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}
                  >
                    <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Container>
        </Layout>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
