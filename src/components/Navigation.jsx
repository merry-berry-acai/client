import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const profileInitial = "A"; // Replace with actual user data if available

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'purple' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <img src="/logo.png" alt="Merry Berry Logo" style={{ height: 48, width: 48 }} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Merry Berry
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/order" variant="contained" color="secondary">
            Order Now
          </Button>
          {!isAuthenticated ? (
            <Button component={Link} to="/login" variant="outlined" color="inherit">
              Login
            </Button>
          ) : (
            <ProfileDropdown profileInitial={profileInitial} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;