import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import CartDropdown from './cart/CartDropdown';
import { getFullImageUrl } from '../utils/imageUtils';
import NavLink from './common/NavLink';

const logo = new URL('../assets/logo.jpg', import.meta.url).href;

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);
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


  // If logo is a relative path, transform it to a full URL
  const logoUrl = logo.startsWith('/') ? getFullImageUrl(logo) : logo;

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
            <NavLink 
              title={link.title} 
              path={link.path} 
              isMobile 
              onClick={handleDrawerToggle} 
            />
          </ListItem>
        ))}
        <Divider />
        {!isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <NavLink 
                title="Login" 
                path="/auth/login" 
                isMobile 
                onClick={handleDrawerToggle} 
              />
            </ListItem>
            <ListItem disablePadding>
              <NavLink 
                title="Sign Up" 
                path="/auth/register" 
                isMobile 
                onClick={handleDrawerToggle} 
              />
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <NavLink 
              title="My Account" 
              path="/account" 
              isMobile 
              onClick={handleDrawerToggle} 
            />
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
                src={logoUrl}
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
                <NavLink 
                  key={link.title} 
                  title={link.title} 
                  path={link.path} 
                  isMobile={false} 
                />
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
              <NavLink 
                title="Login" 
                path="/auth/login" 
                isMobile={false} 
              />
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
