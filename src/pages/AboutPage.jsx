import React from 'react';
import Layout from '../components/Layout';
import { Box, Container, Typography } from '@mui/material';

const AboutPage = () => {
  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            About Merry Berry
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 6 }}>
            Merry Berry is dedicated to serving the finest smoothies and bowls made from 100% organic ingredients. We believe in fresh flavors, sustainable sourcing, and a vibrant community spirit. Our menu is crafted with care to provide a healthy, delicious experience in every bite.
          </Typography>
        </Container>
      </Box>
    </Layout>
  );
};

export default AboutPage;
