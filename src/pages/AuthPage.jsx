import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../contexts/AuthContext";
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Divider, InputAdornment, IconButton, FormControl,
  Alert, CircularProgress, Fade, Chip
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Create validation schema based on variant
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(variant === "signup" ? 6 : 1, 'Password must be at least 6 characters'),
    ...(variant === "signup" && {
      displayName: Yup.string().required('Name is required')
    })
  });

  const initialValues = {
    email: '',
    password: '',
    displayName: variant === "signup" ? '' : undefined,
    favorites: []
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFavoriteToggle = (item, formik) => {
    const currentFavorites = [...formik.values.favorites];
    if (currentFavorites.includes(item)) {
      formik.setFieldValue('favorites', currentFavorites.filter(fav => fav !== item));
    } else {
      formik.setFieldValue('favorites', [...currentFavorites, item]);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    
    try {
      if (variant === "signin") {
        await signIn(values.email, values.password, navigate);
      } else {
        await signUp(
          values.email, 
          values.password, 
          navigate, 
          values.displayName,
          { favorites: values.favorites }
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
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
            
            {/* Server Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Form with Formik */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form>
                  {/* Name Field (only for signup) */}
                  {variant === "signup" && (
                    <Field
                      as={TextField}
                      fullWidth
                      label="Full Name"
                      name="displayName"
                      margin="normal"
                      variant="outlined"
                      required
                      error={touched.displayName && Boolean(errors.displayName)}
                      helperText={touched.displayName && errors.displayName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ 
                              color: touched.displayName && errors.displayName ? 'error.main' : 'purple' 
                            }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  )}
                  
                  {/* Email Field */}
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    required
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ 
                            color: touched.email && errors.email ? 'error.main' : 'purple' 
                          }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  {/* Password Field */}
                  <Field
                    as={TextField}
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    variant="outlined"
                    required
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ 
                            color: touched.password && errors.password ? 'error.main' : 'purple' 
                          }} />
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
                            onClick={() => handleFavoriteToggle(item, { values, setFieldValue })}
                            color={values.favorites.includes(item) ? "primary" : "default"}
                            variant={values.favorites.includes(item) ? "filled" : "outlined"}
                            sx={{ 
                              bgcolor: values.favorites.includes(item) ? 'rgba(128, 0, 128, 0.1)' : 'transparent',
                              color: values.favorites.includes(item) ? 'purple' : 'text.primary',
                              borderColor: values.favorites.includes(item) ? 'purple' : 'inherit',
                              '&:hover': {
                                bgcolor: values.favorites.includes(item) ? 'rgba(128, 0, 128, 0.2)' : 'rgba(0, 0, 0, 0.04)'
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
                    disabled={isSubmitting}
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
                    {isSubmitting ? (
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
                  
                  {variant === "signin" && (
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      <Link 
                        to="/auth/forgot-password"
                        style={{ color: 'purple', textDecoration: 'none', fontWeight: 500 }}
                      >
                        Forgot Password?
                      </Link>
                    </Typography>
                  )}
                </Form>
              )}
            </Formik>
          </Paper>
        </Fade>
      </Container>
      <DebugPanel 
        componentName="AuthPage" 
        props={{ variant }} 
        contextData={{ auth: authContext }}
      />
    </Layout>
  );
};

export default AuthPage;
