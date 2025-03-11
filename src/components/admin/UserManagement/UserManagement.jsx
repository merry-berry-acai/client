import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, Box, Button, Grid, 
  CircularProgress, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserList from './UserList';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import { useApiDebug } from '../common/ApiDebugPanel';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../api/services/userService';
import { AuthContext } from '../../../contexts/AuthContext';

const UserManagement = () => {
  const { logApiRequest } = useApiDebug();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {authToken} = useContext(AuthContext);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const apiUrl = '/api/users'; // Example URL - adjust as needed
      logApiRequest('GET', apiUrl);
      
      const data = await fetchUsers(authToken); 
      setUsers(data);
      setError(null);
      
      logApiRequest('GET', apiUrl, null, { count: data.length, data });
    } catch (err) {
      const errorMessage = 'Failed to load users. Please try again.';
      setError(errorMessage);
      console.error(err);
      logApiRequest('GET', '/api/users', null, null, err.message || errorMessage);
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

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setIsDetailOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentUser(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedUserId(null);
  };

  const handleSaveUser = async (userData) => {
    setLoading(true);
    try {
      if (currentUser) {
        const apiUrl = `/api/users/${currentUser._id}`;
        logApiRequest('PUT', apiUrl, userData);
        
        const response = await updateUser(currentUser._id, userData);
        logApiRequest('PUT', apiUrl, userData, response);
      } else {
        const apiUrl = '/api/users';
        logApiRequest('POST', apiUrl, userData);
        
        const response = await createUser(userData);
        logApiRequest('POST', apiUrl, userData, response);
      }
      await loadUsers();
      handleCloseForm();
    } catch (err) {
      const errorMessage = `Failed to ${currentUser ? 'update' : 'create'} user. Please try again.`;
      setError(errorMessage);
      console.error(err);
      
      logApiRequest(
        currentUser ? 'PUT' : 'POST', 
        currentUser ? `/api/users/${currentUser._id}` : '/api/users', 
        userData, 
        null, 
        err.message || errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        const apiUrl = `/api/users/${userId}`;
        logApiRequest('DELETE', apiUrl);
        
        const response = await deleteUser(userId);
        logApiRequest('DELETE', apiUrl, null, response);
        
        await loadUsers();
      } catch (err) {
        const errorMessage = 'Failed to delete user. Please try again.';
        setError(errorMessage);
        console.error(err);
        
        logApiRequest('DELETE', `/api/users/${userId}`, null, null, err.message || errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">User Management</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Refresh Users">
            <IconButton 
              onClick={loadUsers} 
              disabled={loading}
              sx={{ mr: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
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
          onView={handleViewUser}
        />
      )}
      
      <UserForm 
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
        user={currentUser}
        loading={loading}
      />
      
      <UserDetail
        open={isDetailOpen}
        onClose={handleCloseDetail}
        userId={selectedUserId}
      />
    </Box>
  );
};

export default UserManagement;
