import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import CartDropdown from './cart/CartDropdown';
const logo = new URL('../assets/logo.jpg', import.meta.url).href;

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'purple' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Box
            component="img"
            src={logo}
            alt="Merry Berry Logo"
            sx={{
              height: 48,
              width: 48,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Merry Berry
          </Typography>
        </Link>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CartDropdown />
          <Button component={Link} to="/order" variant="contained" color="secondary">
            Order Now
          </Button>
          {!isAuthenticated ? (
            <Button component={Link} to="/auth/login" variant="outlined" color="inherit">
              Login
            </Button>
          ) : (
            <ProfileDropdown/>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;