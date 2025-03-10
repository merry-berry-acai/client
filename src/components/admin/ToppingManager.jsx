import React, { useState, useContext } from 'react';
import {
  Box, Button, Typography, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { MenuContext } from '../../contexts/MenuContext';
import { createTopping, updateTopping, deleteTopping } from '../../api/apiHandler';
import { toast } from 'react-toastify';
import ServiceFactory from '../../api/services/ServiceFactory';
import { AuthContext } from '../../contexts/AuthContext';

// Import components using barrel files
import { 
  ToppingTable,
  ToppingForm,
  DeleteConfirmationDialog 
} from './components';

const ToppingManager = () => {
  const { toppings, refreshMenuData, loadingMenu } = useContext(MenuContext);
  const { authToken } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentTopping, setCurrentTopping] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isAvailable: true
  });

  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      isAvailable: true
    });
    setFormMode('create');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (topping) => {
    setFormData({
      name: topping?.name || '',
      price: topping?.price ? topping.price.toString() : '',
      description: topping?.description || '',
      isAvailable: topping?.isAvailable !== false
    });
    setCurrentTopping(topping);
    setFormMode('edit');
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (topping) => {
    setCurrentTopping(topping);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentTopping(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRefresh = () => {
    refreshMenuData();
    toast.info('Topping data refreshed from database');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setNotification({
        open: true,
        message: 'Name and price are required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert price to a number and validate
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        throw new Error('Price must be a valid number');
      }
      
      const toppingData = {
        ...formData,
        price: price
      };
      const toppingService = ServiceFactory.getService('toppings');
      
      if (formMode === 'create') {
        await toppingService.createTopping(toppingData, authToken);
        toast.success('Topping created successfully');
      } else if (formMode === 'edit' && currentTopping) {
        await toppingService.updateTopping(currentTopping._id, formData, authToken);
        toast.success('Topping updated successfully');
      }
      
      refreshMenuData();
      handleCloseDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to save topping'),
        severity: 'error'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentTopping) return;
    
    try {
      setLoading(true);
      const toppingService = ServiceFactory.getService('toppings');
      await toppingService.deleteTopping(currentTopping._id, authToken);
      toast.success('Topping deleted successfully');
      
      refreshMenuData();
      handleCloseDeleteDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to delete topping'),
        severity: 'error'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  if (loadingMenu && (!toppings || toppings?.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: 'purple' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Toppings Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              mr: 2,
              color: 'purple',
              borderColor: 'purple',
              '&:hover': { borderColor: 'darkviolet' }
            }}
          >
            Refresh Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{
              bgcolor: 'purple',
              '&:hover': { bgcolor: 'darkviolet' }
            }}
          >
            Add Topping
          </Button>
        </Box>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <ToppingTable 
        toppings={toppings || []} 
        onEdit={handleOpenEditDialog} 
        onDelete={handleOpenDeleteDialog}
      />

      <ToppingForm 
        open={openDialog}
        onClose={handleCloseDialog}
        formMode={formMode}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        itemName={currentTopping?.name}
        loading={loading}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ToppingManager;
