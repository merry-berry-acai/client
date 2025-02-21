import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { handleGoogleSignIn, signIn } from "../utils/firebase";
import GoogleButton from "react-google-button";
import Layout from "../components/Layout";

const SignInPage = () => {

   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
      const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate('/')
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
          Sign In
        </Typography>
        <GoogleButton align='center' onClick={handleGoogleSignIn} />
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
            Sign In
          </Button>
          {/* New link to Sign Up */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account? <Link to="/auth/register">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
    </Layout>
  );
};

export default SignInPage;
