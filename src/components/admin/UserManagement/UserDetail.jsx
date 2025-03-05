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
  CircularProgress 
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';

const UserDetail = ({ open, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && userId) {
      loadUserDetails();
    }
  }, [open, userId]);

  const loadUserDetails = async () => {
    // This would fetch user details from your API
    // For now, it's just a placeholder
    setLoading(true);
    try {
      // const userData = await fetchUserById(userId);
      // setUser(userData);
      
      // Placeholder:
      setTimeout(() => {
        setUser({
          id: userId,
          name: 'User Detail Placeholder',
          email: 'user@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load user details.');
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
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        {error ? (
          <Typography color="error">{error}</Typography>
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
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {user.name}
                </Typography>
                <Chip
                  label={user.role}
                  color={user.role === 'admin' ? 'error' : user.role === 'staff' ? 'warning' : 'success'}
                  sx={{ mt: 1 }}
                />
                <Chip
                  icon={<LockIcon />}
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'default'}
                  variant="outlined"
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
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Created</Typography>
                      </Box>
                    }
                    secondary={new Date(user.createdAt).toLocaleString()}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Last Login</Typography>
                      </Box>
                    }
                    secondary={new Date(user.lastLogin).toLocaleString()}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetail;
