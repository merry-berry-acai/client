import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Grid, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserList from './UserList';
import UserForm from './UserForm';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../api/services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (userData) => {
    setLoading(true);
    try {
      if (currentUser) {
        await updateUser(currentUser._id, userData);
      } else {
        await createUser(userData);
      }
      await loadUsers();
      handleCloseForm();
    } catch (err) {
      setError(`Failed to ${currentUser ? 'update' : 'create'} user. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, my: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">User Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            disabled={loading}
          >
            Add User
          </Button>
        </Box>
        
        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <UserList 
            users={users} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser}
          />
        )}
      </Paper>
      
      <UserForm 
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
        user={currentUser}
        loading={loading}
      />
    </Container>
  );
};

export default UserManagement;
