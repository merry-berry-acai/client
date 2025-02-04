
import React from 'react';
import { Container, Box, Typography, Card, CardMedia, CardContent } from '@mui/material';

const acaiBowl = new URL("../assets/acai-bowl.png", import.meta.url).href;
const smoothie = new URL("../assets/smoothie.png", import.meta.url).href;
const smoothie2 = new URL("../assets/smoothie2.png", import.meta.url).href;

const MenuPage = () => {
  const menuItems = [
    {
      id: 1,
      name: "Classic Açaí Bowl",
      description: "Organic açaí topped with granola and seasonal fruits",
      price: "$9.99",
      image: acaiBowl,
    },
    {
      id: 2,
      name: "Tropical Smoothie",
      description: "Mango, pineapple, and coconut milk blend",
      price: "$7.99",
      image: smoothie,
    },
    {
      id: 3,
      name: "Merry Berry Smoothie",
      description: "Strawberry, blueberry, and banana blend",
      price: "$8.99",
      image: smoothie2,
    },
  ];

  return (
    <Container className="min-h-screen bg-gray-50 p-8">
      <Box className="max-w-4xl mx-auto">
        <Typography variant="h1" className="text-4xl font-bold mb-4">Menu</Typography>
        <Box component="ul">
          {menuItems.map(item => (
            <Card key={item.id} className="mb-6 border p-4 rounded shadow-sm">
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              <CardContent>
                <Typography variant="h2" className="text-2xl font-semibold">{item.name}</Typography>
                <Typography variant="body1" className="text-md text-gray-700">{item.description}</Typography>
                <Typography variant="body2" className="text-lg text-purple-700">{item.price}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default MenuPage;