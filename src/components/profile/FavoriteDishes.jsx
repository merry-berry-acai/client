import React from 'react';
import { 
  Box, Card, CardContent, CardHeader, 
  Typography, Chip 
} from '@mui/material';
import { Heart } from "lucide-react";

const FavoriteDishes = ({ favorites = [] }) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Heart size={20} color="purple" />
            <Typography variant="h6">Favorite Dishes</Typography>
          </Box>
        }
        sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      />
      <CardContent>
        {favorites.length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {favorites.map((dish, index) => (
              <Chip 
                key={index} 
                label={dish} 
                size="medium" 
                sx={{ 
                  bgcolor: 'rgba(128, 0, 128, 0.1)', 
                  color: 'purple',
                  '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.2)' } 
                }} 
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No favorites added yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteDishes;
