import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import ProfileDropdown from './ProfileDropdown';
import CartDropdown from './cart/CartDropdown';

const logo = new URL('../assets/logo.jpg', import.meta.url).href;

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationLinks = [
    { title: 'Home', path: '/' },
    { title: 'Menu', path: '/menu' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navigationLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton 
              component={Link} 
              to={link.path}
              onClick={handleDrawerToggle}
              selected={isActive(link.path)}
            >
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {!isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/auth/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                to="/auth/register"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/account"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="My Account" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{ 
        bgcolor: '#8a2be2', 
        color: 'white',
        borderBottom: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Link to="/" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit' 
            }}>
              <Box
                component="img"
                src={logo}
                alt="Merry Berry Logo"
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1.5,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Merry Berry
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationLinks.map((link) => (
                <Button 
                  key={link.title}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  sx={{ 
                    mx: 0.5,
                    fontWeight: isActive(link.path) ? 700 : 400,
                    borderBottom: isActive(link.path) ? 2 : 0,
                    borderColor: 'white',
                    borderRadius: 0,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      opacity: 0.9,
                    }
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <CartDropdown />
            
            {!isMobile && (
              <Button 
                component={Link} 
                to="/menu" 
                variant="contained" 
                color="secondary"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'flex' },
                  bgcolor: 'white',
                  color: '#8a2be2',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Order Now
              </Button>
            )}

            {!isAuthenticated ? (
              <Button 
                component={Link} 
                to="/auth/login" 
                variant="outlined" 
                color="inherit"
                sx={{ 
                  textTransform: 'none',
                  display: { xs: 'none', sm: 'flex' },
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Login
              </Button>
            ) : (
              <ProfileDropdown />
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navigation;