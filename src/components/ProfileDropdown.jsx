import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { IconButton, Menu, MenuItem, Avatar, Divider } from '@mui/material';
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
      <IconButton onClick={handleOpen} color="primary">
        <Avatar alt={currentUser.displayName} src={photoSrc}>{profileInitial}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>{currentUser.displayName}</MenuItem>
        <Divider />
        
        <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileDropdown;