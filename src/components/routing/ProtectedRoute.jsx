import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { 
  CircularProgress, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  Alert,
  Fade
} from "@mui/material";
import Layout from "../Layout";
import { LockIcon, AlertCircleIcon } from "lucide-react";
import { storeWithExpiry } from "../../utils/localStorage";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [showTimeout, setShowTimeout] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [doRedirect, setDoRedirect] = useState(false);
  const location = useLocation();

  // Save current location for redirect after login using utility function
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // Store for 30 minutes (30 * 60 * 1000 ms)
      storeWithExpiry('redirectAfterLogin', location.pathname, 1800000);
    }
  }, [isAuthenticated, loading, location]);

  // Show timeout message if loading takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setShowTimeout(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Show redirect animation before navigating with proper delay
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      setRedirecting(true);
      
      // Add delay before actual redirect occurs
      const redirectTimer = setTimeout(() => {
        setDoRedirect(true);
      }, 2000); // 2 seconds delay to see the animation
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, loading]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Fade in timeout={500}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 2,
                border: '1px solid rgba(138, 43, 226, 0.2)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress 
                  size={60}
                  thickness={4}
                  sx={{ color: '#8a2be2' }} 
                />
                <Typography variant="h6" sx={{ mt: 2, color: '#8a2be2', fontWeight: 500 }}>
                  Verifying your access...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we check your credentials
                </Typography>
                
                {showTimeout && (
                  <Alert 
                    severity="warning" 
                    sx={{ mt: 2, width: '100%' }}
                  >
                    This is taking longer than expected. You may refresh the page or try again later.
                  </Alert>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Layout>
    );
  }
  
  // Not authenticated - handle redirect with animation
  if (!isAuthenticated) {
    // Only perform the actual redirect after the animation has been shown
    if (doRedirect) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }
    
    // Show redirect animation/message
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Fade in timeout={400}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 2,
                border: '1px solid rgba(220, 53, 69, 0.2)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  backgroundColor: 'rgba(220, 53, 69, 0.1)', 
                  borderRadius: '50%', 
                  p: 2,
                  mb: 1
                }}>
                  <LockIcon color="#dc3545" size={32} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  Authentication Required
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You need to be logged in to access this page.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  We'll redirect you to the login page in a moment.
                </Typography>
                <Button 
                  variant="contained"
                  href="/auth/login"
                  sx={{
                    backgroundColor: '#8a2be2',
                    '&:hover': { backgroundColor: '#6a1fb1' },
                    mt: 1
                  }}
                >
                  Go to Login
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Layout>
    );
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
