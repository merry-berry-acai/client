import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Divider, InputAdornment, IconButton, FormControl,
  FormControlLabel, Checkbox, Alert, CircularProgress,
  Fade, FormHelperText, Chip
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Email, Lock } from '@mui/icons-material';
import { handleGoogleSignIn, signIn, signUp } from "../utils/firebase";
import GoogleButton from "react-google-button";
import Layout from "../components/Layout";
import DebugPanel from "../components/DebugPanel";

const popularItems = [
  "Classic Açaí Bowl", "Tropical Smoothie", "Green Energy Smoothie", 
  "Protein Power Bowl", "Berry Blast", "Mango Tango", "Coconut Dream"
];

const AuthPage = ({ variant }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    favorites: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFavoriteToggle = (item) => {
    setFormData(prev => {
      const currentFavorites = [...prev.favorites];
      if (currentFavorites.includes(item)) {
        return { ...prev, favorites: currentFavorites.filter(fav => fav !== item) };
      } else {
        return { ...prev, favorites: [...currentFavorites, item] };
      }
    });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (variant === "signup" && !formData.displayName) {
      setError('Name is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (variant === "signin") {
        await signIn(formData.email, formData.password, navigate);
      } else {
        await signUp(
          formData.email, 
          formData.password, 
          navigate, 
          formData.displayName,
          { favorites: formData.favorites }
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ my: 8 }}>
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)'
            }}
          >
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'purple',
                mb: 3 
              }}
            >
              {variant === "signin" ? "Welcome Back" : "Create Account"}
            </Typography>
            
            {/* Google Sign In */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <GoogleButton 
                onClick={() => handleGoogleSignIn(navigate)}
                style={{ width: '100%', borderRadius: '4px' }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {variant === "signup" && (
                <TextField
                  fullWidth
                  label="Full Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'purple' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'purple' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'purple' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              {/* Favorite Items Selection (only for signup) */}
              {variant === "signup" && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Select your favorite items (optional)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {popularItems.map((item) => (
                      <Chip 
                        key={item}
                        label={item}
                        clickable
                        onClick={() => handleFavoriteToggle(item)}
                        color={formData.favorites.includes(item) ? "primary" : "default"}
                        variant={formData.favorites.includes(item) ? "filled" : "outlined"}
                        sx={{ 
                          bgcolor: formData.favorites.includes(item) ? 'rgba(128, 0, 128, 0.1)' : 'transparent',
                          color: formData.favorites.includes(item) ? 'purple' : 'text.primary',
                          borderColor: formData.favorites.includes(item) ? 'purple' : 'inherit',
                          '&:hover': {
                            bgcolor: formData.favorites.includes(item) ? 'rgba(128, 0, 128, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </FormControl>
              )}
              
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={loading}
                sx={{ 
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  bgcolor: 'purple',
                  '&:hover': {
                    bgcolor: 'darkviolet',
                  },
                  position: 'relative'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  variant === "signin" ? "Sign In" : "Create Account"
                )}
              </Button>
              
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                {variant === "signin" ? "Don't have an account? " : "Already have an account? "}
                <Link 
                  to={variant === "signin" ? "/auth/register" : "/auth/login"}
                  style={{ color: 'purple', textDecoration: 'none', fontWeight: 500 }}
                >
                  {variant === "signin" ? "Sign Up" : "Sign In"}
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
      <DebugPanel 
        componentName="AuthPage" 
        props={{ variant }} 
        contextData={{ auth: authContext, formState: formData }}
      />
    </Layout>
  );
};

export default AuthPage;
