import React, { useState, useContext, memo, useMemo, useCallback } from "react";
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
import EducatorNote from "../components/EducatorNote";
import { ENV_CONFIG } from "../config";

const popularItems = [
  "Classic Açaí Bowl", "Tropical Smoothie", "Green Energy Smoothie", 
  "Protein Power Bowl", "Berry Blast", "Mango Tango", "Coconut Dream"
];

// Memoized text field component to prevent re-renders
const FormTextField = memo(({ 
  label, name, type, showPassword, handlePasswordVisibility, ...props 
}) => {
  const FieldIcon = name === 'email' ? Email : name === 'password' ? Lock : Person;
  
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          type={name === 'password' ? (showPassword ? 'text' : 'password') : type}
          margin="normal"
          variant="outlined"
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FieldIcon sx={{ 
                  color: meta.touched && meta.error ? 'error.main' : 'purple' 
                }} />
              </InputAdornment>
            ),
            ...(name === 'password' && {
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
              )
            })
          }}
          sx={{ mb: 2 }}
          {...props}
        />
      )}
    </Field>
  );
});

// Memoized favorite item chips
const FavoriteItems = memo(({ values, handleFavoriteToggle }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {popularItems.map((item) => (
      <Chip 
        key={item}
        label={item}
        clickable
        onClick={() => handleFavoriteToggle(item)}
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
));

const AuthPage = ({ variant }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  // Memoize validation schema to prevent recreation on each render
  const validationSchema = useMemo(() => Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(variant === "signup" ? 6 : 1, 'Password must be at least 6 characters'),
    ...(variant === "signup" && {
      displayName: Yup.string().required('Name is required')
    })
  }), [variant]);

  const initialValues = useMemo(() => ({
    email: '',
    password: '',
    displayName: variant === "signup" ? '' : undefined,
    favorites: []
  }), [variant]);

  const handlePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleFavoriteToggle = useCallback((item, formik) => {
    const currentFavorites = [...formik.values.favorites];
    if (currentFavorites.includes(item)) {
      formik.setFieldValue('favorites', currentFavorites.filter(fav => fav !== item));
    } else {
      formik.setFieldValue('favorites', [...currentFavorites, item]);
    }
  }, []);

  const handleSubmit = useCallback(async (values, { setSubmitting }) => {
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
      Sentry.captureException(error, { 
        extra: { 
          action: "handleSubmit", 
          authVariant: variant 
        } 
      });
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [variant, navigate]);

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
            
            {/* Educator Note with Testing Credentials */}
            {ENV_CONFIG.isDevelopment && (
              <EducatorNote sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  For testing purposes, you can use these demo accounts:
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: 1 }}>
                  <Box sx={{ bgcolor: 'rgba(138, 43, 226, 0.05)', p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#6a1fb1' }}>
                      User Account:
                    </Typography>
                    <Typography variant="body2">Email: user@merry-berry.com.au</Typography>
                    <Typography variant="body2">Password: user123</Typography>
                  </Box>
                  
                  <Box sx={{ bgcolor: 'rgba(138, 43, 226, 0.05)', p: 1, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#6a1fb1' }}>
                      Admin Account:
                    </Typography>
                    <Typography variant="body2">Email: admin@merry-berry.com.au</Typography>
                    <Typography variant="body2">Password: admin123</Typography>
                  </Box>
                </Box>
              </EducatorNote>
            )}
            
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
              validateOnChange={false} // Only validate on blur and submit
              validateOnBlur={true}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form>
                  {/* Name Field (only for signup) */}
                  {variant === "signup" && (
                    <FormTextField
                      label="Full Name"
                      name="displayName"
                      required
                    />
                  )}
                  
                  {/* Email Field */}
                  <FormTextField
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                  />
                  
                  {/* Password Field */}
                  <FormTextField
                    label="Password"
                    name="password"
                    required
                    showPassword={showPassword}
                    handlePasswordVisibility={handlePasswordVisibility}
                  />
                  
                  {/* Favorite Items Selection (only for signup) */}
                  {variant === "signup" && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Select your favorite items (optional)
                      </Typography>
                      <FavoriteItems 
                        values={values}
                        handleFavoriteToggle={(item) => handleFavoriteToggle(item, { values, setFieldValue })}
                      />
                    </FormControl>
                  )}
                  
                  <Button
                    type="submit"
                    sx={{
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

export default memo(AuthPage);
