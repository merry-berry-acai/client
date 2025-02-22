import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { handleGoogleSignIn, signIn, signUp } from "../utils/firebase";
import GoogleButton from "react-google-button";
import Layout from "../components/Layout";

const AuthPage = () => {
  const variant = location.pathname.includes("login") ? "signin" : "signup";
   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (variant === "signin") {
            await signIn(email, password, navigate);
          } else  {
            await signUp(email, password, navigate);
          }
            // Handle successful login
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error
        }

    };

  return (
    <Layout>
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
        {variant === "signin" ? "Sign In" : "Sign Up"}
        </Typography>
        {/* Center the Google Button */}
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <GoogleButton onClick={() => handleGoogleSignIn(navigate)} />
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          {variant === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          {/* New link to Sign Up */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {variant === "signin" ? "Don't have an account? " : "Already have an account? "}
          <Link to={variant === "signin" ? "/auth/register" : "/auth/login"}>
            {variant === "signin" ? "Sign Up" : "Sign In"}
          </Link>
            
          </Typography>
        </Box>
      </Paper>
    </Container>
    </Layout>
  );
};

export default AuthPage;
