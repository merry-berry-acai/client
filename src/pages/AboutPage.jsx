import React from 'react';
import Layout from '../components/Layout';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  Paper 
} from '@mui/material';

const AboutPage = () => {
  return (
    <Layout>
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              About Merry Berry
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Fresh, healthy, and delicious smoothies & bowls made with love in Brisbane
            </Typography>
          </Box>

          {/* Our Story Section */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h4" gutterBottom>Our Story</Typography>
                <Typography variant="body1" paragraph>
                  Founded in 2024 as a school project, Merry Berry started with a simple idea: make healthy eating 
                  delicious and accessible. What began as a concept quickly blossomed into a vision for a 
                  community-focused eatery where health-conscious customers could enjoy fresh smoothies and açaí bowls.
                </Typography>
                <Typography variant="body1">
                  Today, we're proud to offer a wide range of customizable menu items, crafted with organic 
                  ingredients and sustainable practices at the heart of everything we do.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ height: '300px', bgcolor: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" color="textSecondary">
                  [Image of our store would appear here]
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Our Mission */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Our Mission</Typography>
            <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
              At Merry Berry, we're dedicated to serving the finest smoothies and bowls made from 100% organic ingredients. 
              We believe in fresh flavors, sustainable sourcing, and building a vibrant community where health and
              happiness go hand in hand.
            </Typography>
          </Box>

          {/* What Makes Us Different */}
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            What Makes Us Different
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {[
              { 
                title: "Fresh Ingredients", 
                desc: "We source only the freshest organic fruits and superfoods for our menu items." 
              },
              { 
                title: "Customizable Options", 
                desc: "Create your perfect bowl or smoothie with our range of sizes, toppings, and add-ins." 
              },
              { 
                title: "Sustainable Practices", 
                desc: "From our eco-friendly packaging to our waste reduction efforts, we're committed to the planet." 
              },
              { 
                title: "Community Focus", 
                desc: "We're more than just a smoothie shop - we're a gathering place for health-conscious individuals." 
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Tech Stack - School Project Note */}
          <Paper sx={{ p: 4, mb: 8, bgcolor: '#e3f2fd' }}>
            <Typography variant="h5" gutterBottom>About This Project</Typography>
            <Typography variant="body1" paragraph>
              This website is a school project built with React 18.2, featuring responsive design, 
              menu browsing, order customization, and a persistent shopping cart experience.
            </Typography>
            <Typography variant="body1">
              While Merry Berry is a fictional business, we've designed this platform to showcase
              the implementation of modern web technologies in creating an engaging user experience.
            </Typography>
          </Paper>

          {/* Visit Us CTA */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom>Visit Us Today</Typography>
            <Typography variant="body1">
              Monday - Friday: 8am - 8pm<br />
              Saturday - Sunday: 9am - 6pm<br />
              <br />
              123 Smoothie Lane<br />
              Brisbane, QLD 4000
            </Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default AboutPage;
