import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Button, Card, CardContent, CardHeader, Typography, 
  Chip, Box, Avatar, Container, Divider, 
  Paper
} from '@mui/material';
import {
  User,
  FileText,
  Mail,
  Edit,
  Clock,
  Heart
} from "lucide-react";
import Layout from "../components/Layout";
import { AuthContext } from '../contexts/AuthContext';
import { getOrdersByUserId } from '../api/mockApi';
import { getUserPhoto } from '../utils/localStorage';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites] = useState(["Classic Açaí Bowl", "Tropical Smoothie", "Green Energy Smoothie", "Protein Power Bowl"]);

  useEffect(() => {
    setLoading(true);
    getOrdersByUserId(currentUser.uid)
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);  // Ensure we always set an array
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load order history");
        setLoading(false);
        setOrders([]);
      });
  }, [currentUser]);

  const photoData = getUserPhoto();
  const defaultPhoto = "/assets/default-user.png";
  const photoSrc = photoData || currentUser?.photoURL || defaultPhoto;
  const profileInitial = currentUser?.displayName ? currentUser?.displayName?.charAt(0) : 'U';

  return (
    <Layout>
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "calc(100vh - 64px)" }}>
        <Container sx={{ py: 4 }}>
          {/* Profile Header */}
          <Paper 
            elevation={2} 
            sx={{ 
              mb: 4, 
              borderRadius: 2, 
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Box 
              sx={{ 
                height: 100, 
                bgcolor: 'rgba(128, 0, 128, 0.1)', 
                position: 'relative'
              }}
            />
            
            <Box sx={{ px: 3, pb: 3, pt: 6, position: 'relative' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid white', 
                  position: 'absolute',
                  top: -60,
                  left: 30,
                  bgcolor: 'purple',
                  fontSize: '2.5rem'
                }}
                alt={currentUser.displayName}
                src={photoSrc}
              >
                {profileInitial}
              </Avatar>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: { xs: 0, sm: 18 } }}>
                <Box>
                  <Typography variant="h4" fontWeight="medium" gutterBottom>
                    {currentUser.displayName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} />
                    <Typography variant="body2" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Edit size={16} />}
                  sx={{ 
                    height: 'fit-content',
                    color: 'purple',
                    borderColor: 'purple',
                    '&:hover': { borderColor: 'darkviolet' }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* Main Content */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, 
            gap: 4 
          }}>
            {/* Left Column - Order History */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={20} color="purple" />
                    <Typography variant="h6">Order History</Typography>
                  </Box>
                }
                sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              />
              <CardContent>
                {loading ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">Loading order history...</Typography>
                  </Box>
                ) : error ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="error">{error}</Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2, color: 'purple', borderColor: 'purple' }}
                      onClick={() => {
                        setLoading(true);
                        setError(null);
                        getOrdersByUserId(currentUser.uid)
                          .then((data) => {
                            setOrders(data || []);
                            setLoading(false);
                          })
                          .catch(() => {
                            setError("Failed to load order history");
                            setLoading(false);
                          });
                      }}
                    >
                      Try Again
                    </Button>
                  </Box>
                ) : (!orders || orders.length === 0) ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">No orders yet</Typography>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        mt: 2,
                        bgcolor: 'purple',
                        '&:hover': { bgcolor: 'darkviolet' }
                      }}
                      onClick={() => navigate('/menu')}
                    >
                      Browse Menu
                    </Button>
                  </Box>
                ) : (
                  orders.map((order, index) => (
                    <React.Fragment key={index}>
                      <Box sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {order?.title || 'Untitled Order'}
                          </Typography>
                          <Chip 
                            label={order?.status || "Completed"} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(128, 0, 128, 0.1)', 
                              color: 'purple',
                              fontWeight: 'medium'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {order?.period || 'No date available'}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {order?.description || 'No description available'}
                        </Typography>
                      </Box>
                      {index < orders.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Right Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Favorite Dishes */}
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

              {/* Support */}
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader 
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={20} color="purple" />
                      <Typography variant="h6">Support</Typography>
                    </Box>
                  }
                  sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<FileText size={16} />} 
                    sx={{ 
                      color: 'purple',
                      borderColor: 'purple',
                      '&:hover': { borderColor: 'darkviolet' }
                    }}
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<FileText size={16} />}
                    sx={{ 
                      color: 'purple',
                      borderColor: 'purple',
                      '&:hover': { borderColor: 'darkviolet' }
                    }}
                  >
                    FAQs & Help
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
