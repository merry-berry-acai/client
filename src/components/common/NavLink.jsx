import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, ListItemButton, ListItemText } from '@mui/material';

const NavLink = ({ title, path, isMobile, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  if (isMobile) {
    return (
      <ListItemButton
        component={Link}
        to={path}
        onClick={onClick}
        selected={isActive}
      >
        <ListItemText primary={title} />
      </ListItemButton>
    );
  }

  return (
    <Button
      component={Link}
      to={path}
      color="inherit"
      sx={{
        mx: 0.5,
        fontWeight: isActive ? 700 : 400,
        borderBottom: isActive ? 2 : 0,
        borderColor: 'white',
        borderRadius: 0,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
          opacity: 0.9,
        },
      }}
    >
      {title}
    </Button>
  );
};

export default NavLink;
