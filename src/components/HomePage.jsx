import { FaHeart, FaClock, FaLeaf } from "react-icons/fa";
import { useState } from "react";
import FeaturedItem from "./FeaturedItems";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button, Grid } from "@mui/material";

const acaiBowl = new URL("../assets/acai-bowl.png", import.meta.url).href;
const smoothie = new URL("../assets/smoothie.png", import.meta.url).href;
const smoothie2 = new URL("../assets/smoothie2.png", import.meta.url).href;
const logo = new URL("../assets/logo.jpg", import.meta.url).href;

const HomePage = () => {

  // Temporary data - replace with API calls
  const featuredItems = [
    {
      id: 1,
      name: "Classic Açaí Bowl",
      price: 9.99,
      fsf: 1.055,
      description: "Organic açaí topped with granola and seasonal fruits",
      image: acaiBowl,
    },
    {
      id: 2,
      name: "Tropical Smoothie",
      price: 7.99,
      fsf: 1.055,
      description: "Mango, pineapple, and coconut milk blend",
      image: smoothie,
    },
    {
      id: 3,
      name: "Merry Berry Smoothie",
      price: 8.99,
      fsf: 1.055,
      description: "Strawberry, blueberry, and banana blend",
      image: smoothie2,
    },
  ];

  return (
    <Box>
      <Box sx={{
        background: 'linear-gradient(to bottom, #8e24aa, #4a148c)',
        color: '#fff',
        py: 8,
        textAlign: 'center'
      }}>
        <Container>
            <Box
              component="img"
              src={logo}
              alt="Merry Berry Logo"
              sx={{
                display: "block",
                margin: "0 auto",
                borderRadius: "50%",
                mb: 2
              }}
            />
          <Typography variant="h2" gutterBottom>
            Craft Your Perfect Bowl
          </Typography>
          <Typography variant="h5" gutterBottom>
            Fresh ingredients, endless combinations
          </Typography>
          <Button component={Link} to="/order" variant="contained" sx={{ mt: 2 }}>
            Start Your Order
          </Button>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Most Popular Creations
        </Typography>
        <Grid container spacing={4}>
          {featuredItems.map((item) => (
            <Grid item key={item.id} xs={12} md={6} lg={4}>
              <FeaturedItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} textAlign="center">
              <FaLeaf size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">100% Organic</Typography>
              <Typography>Locally sourced ingredients</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <FaClock size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">Order Online</Typography>
              <Typography>Skip the Line</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center">
              <FaHeart size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">Customizable</Typography>
              <Typography>Build your perfect combination</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
