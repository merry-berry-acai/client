import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, Typography, Chip, Box, Avatar } from '@mui/material';
import { Container } from '@mui/material';
import {
  User,
  Mail,
  Phone,
  Globe,
  FileText,
} from "lucide-react";
import Layout from "../components/Layout";
import { AuthContext } from '../contexts/AuthContext';
import { getOrdersByUserId } from '../api/mockApi';
import { getUserPhoto } from '../utils/localStorage';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  // Placeholder favorites; in a real system this might be fetched from an API
  const [favorites] = useState(["Classic Açaí Bowl", "Tropical Smoothie"]);

  useEffect(() => {
    if(currentUser) {
      getOrdersByUserId(currentUser.uid).then((data) => {
        setOrders(data);
      });
    }
  }, [currentUser]);

  const photoData = getUserPhoto();
    const photoSrc = photoData || currentUser.photoURL || null;

  if (!currentUser) {
    return (
      // Fallback UI when user data is missing
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>User not found.</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
        <Container sx={{ py: 4 }}>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* Profile Header */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: "rgba(25, 118, 210, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Avatar sx={{ width: 64, height: 64 }} alt={currentUser.displayName} src={photoSrc}></Avatar>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2">
                      {currentUser.displayName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currentUser.email}
                    </Typography>
                    {/* Removed non-restaurant details */}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 4 }}>
              {/* Main Information */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Previous Orders */}
                <Card>
                  <CardHeader title="Order History" />
                  <CardContent>
                    {typeof orders === "string" ? (
                      <Typography variant="body2">{orders}</Typography>
                    ) : (
                      orders.map((order, index) => (
                        <Box key={index} sx={{ mb: index < orders.length - 1 ? 2 : 0, borderBottom: index < orders.length - 1 ? "1px solid rgba(0,0,0,0.12)" : "none", pb: 2 }}>
                          <Typography variant="subtitle1">{order.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {order.company}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {order.period}
                          </Typography>
                          <Typography variant="body2">{order.description}</Typography>
                        </Box>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Favorites (formerly Skills) */}
                <Card>
                  <CardHeader title="Favorite Dishes" />
                  <CardContent>
                    {favorites.length ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {favorites.map((dish, index) => (
                          <Chip key={index} label={dish} color="primary" size="small" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2">No favorites added.</Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Sidebar */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Delivery Details */}
                <Card>
                  <CardHeader title="Delivery Details" />
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Mail style={{ width: 16, height: 16 }} />
                      <Typography variant="body2">{currentUser.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Phone style={{ width: 16, height: 16 }} />
                      {/* Replace with currentUser.phoneNumber if available */}
                      <Typography variant="body2">+1 (555) 123-4567</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Globe style={{ width: 16, height: 16 }} />
                      {/* Replace with currentUser.address if available */}
                      <Typography variant="body2">123 Main St, City</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Support */}
                <Card>
                  <CardHeader title="Support" />
                  <CardContent>
                    <Button variant="outlined" fullWidth startIcon={<FileText style={{ width: 16, height: 16 }} />} sx={{ mb: 1 }}>
                      Contact Us
                    </Button>
                    <Button variant="outlined" fullWidth startIcon={<FileText style={{ width: 16, height: 16 }} />}>
                      FAQs
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </Layout>
  );
};

export default Profile;