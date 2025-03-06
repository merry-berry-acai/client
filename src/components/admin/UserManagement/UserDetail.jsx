import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Grid, 
  Box, 
  Avatar, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Alert
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PhoneIcon from '@mui/icons-material/Phone';
import { fetchUserById } from '../../../api/services/userService';
import { useApiDebug } from '../common/ApiDebugPanel';

const UserDetail = ({ open, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logApiRequest } = useApiDebug();

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    } else {
      // Clear user data when modal closes
      setUser(null);
    }
  }, [open, userId]);

  const loadUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `/api/users/${userId}`;
      logApiRequest('GET', apiUrl);
      
      const userData = await fetchUserById(userId);
      setUser(userData);
      
      logApiRequest('GET', apiUrl, null, { userData });
    } catch (err) {
      const errorMessage = 'Failed to load user details.';
      setError(errorMessage);
      console.error(err);
      
      logApiRequest('GET', `/api/users/${userId}`, null, null, err.message || errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'admin': return '#f44336';
      case 'staff': return '#ff9800';
      default: return '#4caf50';
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  // Get first letter of name safely
  const getNameInitial = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">User Details</Typography>
          {user && <Typography variant="subtitle2" color="text.secondary">ID: {user._id}</Typography>}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : user ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: getAvatarColor(user.role),
                    fontSize: '3rem'
                  }}
                >
                  {getNameInitial(user?.displayName)}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {user.displayName || 'Unnamed User'}
                </Typography>
                <Chip
                  label={user.role}
                  color={user.role === 'admin' ? 'error' : user.role === 'staff' ? 'warning' : 'success'}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <MailOutlineIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Email</Typography>
                      </Box>
                    }
                    secondary={user.email}
                  />
                </ListItem>
                <Divider component="li" />
                
                {user.phone && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <PhoneIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1">Phone</Typography>
                          </Box>
                        }
                        secondary={user.phone}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Created At</Typography>
                      </Box>
                    }
                    secondary={formatDate(user.createdAt)}
                  />
                </ListItem>
                <Divider component="li" />
                
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Updated At</Typography>
                      </Box>
                    }
                    secondary={formatDate(user.updatedAt)}
                  />
                </ListItem>
                <Divider component="li" />
                
                {user.lastLogin && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <EventIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1">Last Login</Typography>
                          </Box>
                        }
                        secondary={formatDate(user.lastLogin)}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {user.orderCount !== undefined && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <ShoppingCartIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1">Order Count</Typography>
                          </Box>
                        }
                        secondary={user.orderCount}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </>
                )}
                
                {user.address && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <PersonOutlineIcon sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">Address</Typography>
                        </Box>
                      }
                      secondary={user.address}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetail;
