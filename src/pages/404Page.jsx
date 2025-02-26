import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import Layout from "../components/Layout";

const PageNotFound = () => {
  return (
    <Layout>
      <Box 
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: '#f9f4fc',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0'
            }}
          >
            <SentimentDissatisfiedIcon 
              sx={{ 
                fontSize: { xs: 80, md: 120 }, 
                color: '#8e24aa',
                mb: 2
              }} 
            />
            
            <Typography 
              variant="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8e24aa, #4a148c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              404
            </Typography>
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#333'
              }}
            >
              Page Not Found
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4,
                color: 'text.secondary',
                fontSize: '1.1rem',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              The page you're looking for doesn't exist or has been moved.
              Please check the URL or navigate back to our homepage.
            </Typography>
            
            <Button 
              component={Link} 
              to="/" 
              variant="contained" 
              color="secondary"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Back to Home
            </Button>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default PageNotFound;