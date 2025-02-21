import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { signOutUser } from '../utils/firebase';

const ProfileDropdown = ({ profileInitial }) => {
  const { logout } = useContext(AuthContext);
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
        <Avatar>{profileInitial}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileDropdown;
