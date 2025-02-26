import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { IconButton, Menu, MenuItem, Avatar, Divider, Typography, Box } from '@mui/material';
import { signOutUser } from '../utils/firebase';
import { getUserPhoto } from '../utils/localStorage';

const ProfileDropdown = () => {
  const { currentUser } = useContext(AuthContext);

  const profileInitial = currentUser.displayName ? currentUser.displayName.charAt(0) : 'U';
  const photoData = getUserPhoto();
  const photoSrc = photoData || currentUser.photoURL || null;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOutUser();
    navigate('/');
    handleClose();
  };

  return (
    <div>
      <IconButton 
        onClick={handleOpen} 
        sx={{ 
          color: 'purple',
          '&:hover': { 
            bgcolor: 'rgba(128, 0, 128, 0.08)' 
          } 
        }}
      >
        <Avatar 
          alt={currentUser.displayName} 
          src={photoSrc}
          sx={{ 
            bgcolor: photoSrc ? 'transparent' : 'purple',
            color: '#fff'
          }}
        >
          {profileInitial}
        </Avatar>
      </IconButton>
      
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 200,
            borderRadius: 1,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {currentUser.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {currentUser.email}
          </Typography>
        </Box>
        <Divider />
        
        <MenuItem 
          onClick={handleClose} 
          component={Link} 
          to="/profile"
          sx={{ 
            color: 'purple',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.08)' } 
          }}
        >
          Profile
        </MenuItem>
        
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            color: 'purple',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.08)' } 
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileDropdown;