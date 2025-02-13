import { FaHeart, FaClock, FaLeaf } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import Layout from "../components/Layout";
import MenuItem from "../components/menu-browsing/MenuItem";
import { getFeaturedItems } from "../api/mockApi";

const logo = new URL("../assets/logo.jpg", import.meta.url).href;

const HomePage = () => {
  // Fetch featured items from API
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    getFeaturedItems().then(data => setFeaturedItems(data));
  }, []);

  return (
    <Layout>
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
        <Box sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }
        }}>
          {featuredItems.length === 0 ? (
            <Typography>Loading...</Typography>
          ) : (
            featuredItems.map((item) => (
              <Box key={item.id}>
                <MenuItem item={item} />
              </Box>
            ))
          )}
        </Box>
      </Container>

      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container>
          <Box container spacing={4}>
            <Box item xs={12} md={4} textAlign="center">
              <FaLeaf size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">100% Organic</Typography>
              <Typography>Locally sourced ingredients</Typography>
            </Box>
            <Box item xs={12} md={4} textAlign="center">
              <FaClock size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">Order Online</Typography>
              <Typography>Skip the Line</Typography>
            </Box>
            <Box item xs={12} md={4} textAlign="center">
              <FaHeart size={32} style={{ color: '#8e24aa' }} />
              <Typography variant="h6">Customizable</Typography>
              <Typography>Build your perfect combination</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;
