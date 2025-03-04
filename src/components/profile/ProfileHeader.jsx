import React, { useContext } from 'react';
import { Box, Avatar, Typography, Button, Paper } from '@mui/material';
import { Edit, Mail } from "lucide-react";
import { AuthContext } from '../../contexts/AuthContext';
import { getUserPhoto } from '../../utils/localStorage';

const ProfileHeader = () => {
  const { currentUser } = useContext(AuthContext);
  
  const photoData = getUserPhoto();
  const defaultPhoto = "/assets/default-user.png";
  const photoSrc = photoData || currentUser?.photoURL || defaultPhoto;
  const profileInitial = currentUser?.displayName ? currentUser?.displayName?.charAt(0) : 'U';

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 4, 
        borderRadius: 2, 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{ 
          height: 100, 
          bgcolor: 'rgba(128, 0, 128, 0.1)', 
          position: 'relative'
        }}
      />
      
      <Box sx={{ px: 3, pb: 3, pt: 6, position: 'relative' }}>
        <Avatar 
          sx={{ 
            width: 120, 
            height: 120, 
            border: '4px solid white', 
            position: 'absolute',
            top: -60,
            left: 30,
            bgcolor: 'purple',
            fontSize: '2.5rem'
          }}
          alt={currentUser.displayName}
          src={photoSrc}
        >
          {profileInitial}
        </Avatar>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: { xs: 0, sm: 18 } }}>
          <Box>
            <Typography variant="h4" fontWeight="medium" gutterBottom>
              {currentUser.displayName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mail size={16} />
              <Typography variant="body2" color="text.secondary">
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
          
          <Button 
            variant="outlined" 
            startIcon={<Edit size={16} />}
            sx={{ 
              height: 'fit-content',
              color: 'purple',
              borderColor: 'purple',
              '&:hover': { borderColor: 'darkviolet' }
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
