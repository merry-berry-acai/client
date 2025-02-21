import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import { handleGoogleSignIn, signUp } from "../utils/firebase";
import Layout from "../components/Layout";
import GoogleButton from "react-google-button";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await signUp(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 2, marginTop: 8 }}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <GoogleButton align='center' onClick={handleGoogleSignIn} />
          <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {/* New link to Sign In */}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <Link to="/auth/login">Sign In</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SignUpPage;
