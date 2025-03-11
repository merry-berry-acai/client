import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Box, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: '#4a148c', color: '#fff', py: 6, mt: 4 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Merry Berry</Typography>
            <Typography variant="body2">
              Fresh, healthy, and delicious smoothies & bowls
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Navigation</Typography>
            <Typography variant="body2">
              <Link to="/" style={{ color: '#fff' }}>Home</Link><br />
              <Link to="/menu" style={{ color: '#fff' }}>Menu</Link><br />
              <Link to="/about" style={{ color: '#fff' }}>About</Link><br />
              <Link to="/contact" style={{ color: '#fff' }}>Contact</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Hours & Location</Typography>
            <Typography variant="body2">
              Monday - Friday: 8am - 8pm<br />
              Saturday - Sunday: 9am - 6pm<br />
              <br />
              123 Smoothie Lane<br />
              Brisbane, QLD 4000
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="body2" align="center">
          © {currentYear} Merry Berry. This website is a school project.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer;
