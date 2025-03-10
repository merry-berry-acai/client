import { FaHeart, FaClock, FaLeaf, FaArrowRight, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button, Grid, Card, CardContent, Divider, Paper, Chip } from "@mui/material";
import Layout from "../components/Layout";
import MenuItem from "../components/menu-browsing/MenuItem";
import { MenuContext } from "../contexts/MenuContext";

const logo = new URL("../assets/logo.jpg", import.meta.url).href;

const HomePage = () => {
  // Fetch featured items from API
  const {featuredItems} = useContext(MenuContext);

  return (
    <Layout>
      {/* Hero Section */}
      <Box sx={{
          background: 'linear-gradient(135deg, #8e24aa, #4a148c)',
          color: '#fff',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          borderBottom: '5px solid #6a1b9a',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Container maxWidth="md">
          {/* Project Indicator */}
          <Chip 
            icon={<FaInfoCircle />} 
            label="School Project" 
            color="default" 
            size="small"
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: '#4a148c',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)'
              }
            }}
          />
          
          <Box
            component="img"
            src={logo}
            alt="Merry Berry Logo"
            sx={{
              width: { xs: 120, md: 150 },
              height: { xs: 120, md: 150 },
              display: "block",
              margin: "0 auto",
              borderRadius: "50%",
              mb: 4,
              border: "4px solid white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          />
          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", md: "4rem" },
              mb: 2,
              letterSpacing: "-0.5px"
            }}
          >
            Craft Your Perfect Bowl
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              maxWidth: "700px",
              mx: "auto",
              opacity: 0.9,
              fontWeight: 300
            }}
          >
            Fresh ingredients, endless combinations, made with love
          </Typography>
          <Button 
            component={Link} 
            to="/menu" 
            variant="contained" 
            size="large"
            endIcon={<FaArrowRight />}
            sx={{ 
              mt: 2,
              py: 1.5, 
              px: 4,
              borderRadius: 2,
              fontSize: "1.1rem",
              textTransform: "none",
              backgroundColor: "#fff",
              color: "#4a148c",
              '&:hover': {
                backgroundColor: "#f3e5f5",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)"
              }
            }}
          >
            Start Your Order
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#fff', py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', textAlign: "center", border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <FaLeaf size={40} style={{ color: '#8e24aa', marginBottom: '16px' }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>100% Organic</Typography>
                <Typography variant="body1" color="text.secondary">We're committed to using locally sourced, fresh ingredients in all our bowls.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', textAlign: "center", border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <FaClock size={40} style={{ color: '#8e24aa', marginBottom: '16px' }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>Order Online</Typography>
                <Typography variant="body1" color="text.secondary">Skip the line by ordering ahead through our convenient online platform.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 4, height: '100%', textAlign: "center", border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <FaHeart size={40} style={{ color: '#8e24aa', marginBottom: '16px' }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>Customizable</Typography>
                <Typography variant="body1" color="text.secondary">Build your perfect bowl with our wide variety of bases, toppings, and dressings.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Items Section */}
      <Box sx={{ py: 8, backgroundColor: '#f9f4fc' }}>
        <Container>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.75rem" },
                mb: 1,
                color: '#4a148c'
              }}
            >
              Most Popular Creations
            </Typography>
            <Divider sx={{ width: '80px', margin: '16px auto', borderColor: '#8e24aa', borderWidth: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mt: 2 }}>
              Discover our customers' favorite bowls, crafted with the freshest ingredients
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {!featuredItems?.length ? (
              <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Loading featured items...</Typography>
              </Grid>
            ) : (
              featuredItems?.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item?._id}>
                  <MenuItem key={item?._id} item={item} />
                </Grid>
              ))
            )}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              component={Link} 
              to="/menu" 
              variant="outlined" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderColor: '#8a2be2',
                color: '#8a2be2',
                '&:hover': {
                  borderColor: '#6a1fb1',
                  backgroundColor: 'rgba(138, 43, 226, 0.08)'
                }
              }}
            >
              View Full Menu
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: '#fff', py: 8 }}>
        <Container>
          <Typography 
            variant="h3" 
            textAlign="center" 
            mb={6} 
            sx={{ 
              fontWeight: 600,
              color: '#4a148c'
            }}
          >
            What Our Customers Say
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "The açai bowl was incredible! Fresh fruit, perfect texture, and the staff was so friendly."
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#8a2be2' }}>
                    - Sarah M.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "I love being able to customize my bowl exactly how I want it. Great variety and always fresh!"
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#8a2be2' }}>
                    - Michael T.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "The online ordering system is so convenient. My go-to lunch spot during work days!"
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#8a2be2' }}>
                    - Jessica L.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Project Info Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={600} color="#4a148c" gutterBottom>
                About This Project
              </Typography>
              <Typography variant="body1" paragraph>
                This Merry Berry website is a school project created as part of the Coder Academy curriculum. It showcases 
                frontend development skills using React, Material UI, and context management.
              </Typography>
              <Typography variant="body1">
                While this is a demo site, we've designed it to demonstrate realistic e-commerce functionality 
                for a hypothetical single-location açai bowl shop.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="#4a148c">
                    <FaMapMarkerAlt style={{ marginRight: '8px' }} /> Our Demo Location
                  </Typography>
                  <Typography variant="body1" paragraph>
                    123 Smoothie Lane<br />
                    Brisbane, QLD 4000<br />
                    Australia
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Hours:</strong> Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ 
        backgroundColor: '#8e24aa', 
        py: { xs: 6, md: 10 }, 
        color: 'white', 
        textAlign: 'center'
      }}>
        <Container>
          <Typography variant="h3" fontWeight={700} mb={3}>
            Ready to Try Merry Berry?
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '700px', mx: 'auto', mb: 4, opacity: 0.9 }}>
            Experience our demo ordering system and explore the features we've built
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              component={Link} 
              to="/menu" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                backgroundColor: 'white', 
                color: '#8e24aa', 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': { 
                  backgroundColor: '#f3e5f5',
                }
              }}
            >
              Order Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;
