import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, Typography, Paper, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { MenuContext } from '../../contexts/MenuContext';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/apiHandler';
import { toast } from 'react-toastify';

// Import our new components
import MenuItemTable from './components/MenuItemTable';
import MenuItemForm from './components/MenuItemForm';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

const ItemManager = () => {
  const { menuItems, categories, refreshMenuData, loadingMenu } = useContext(MenuContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    categoryId: '',
    image: '',
    details: '',
    isAvailable: true,
    isFeatured: false
  });

  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      categoryId: '',
      image: '',
      details: '',
      isAvailable: true,
      isFeatured: false
    });
    setImageFile(null);
    setImagePreview('');
    setFormMode('create');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (item) => {
    setFormData({
      name: item.name || '',
      description: item.description || '',
      basePrice: item.basePrice ? item.basePrice.toString() : '',
      categoryId: item.categoryId || '',
      image: item.image || '',
      details: item.details || '',
      isAvailable: item.isAvailable !== false,
      isFeatured: !!item.isFeatured
    });
    setCurrentItem(item);
    setImagePreview(item.image || '');
    setImageFile(null);
    setFormMode('edit');
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (item) => {
    setCurrentItem(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleClearImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData({...formData, image: ''});
  };

  const handleRefresh = () => {
    refreshMenuData();
    toast.info('Menu data refreshed from database');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.basePrice) {
      setNotification({
        open: true,
        message: 'Name and price are required fields',
        severity: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert basePrice to a number and validate
      const basePrice = parseFloat(formData.basePrice);
      if (isNaN(basePrice) || basePrice <= 0) {
        throw new Error('Price must be a positive number');
      }
      
      const itemData = {
        ...formData,
        basePrice: basePrice
      };
      
      // If we have a new image file, we'd upload it here and get the URL
      // For this example, we'll assume the image is already a URL string or use a placeholder
      if (!itemData.image && !imageFile) {
        // Set a placeholder image if no image provided
        itemData.image = 'https://via.placeholder.com/300x200?text=No+Image';
      }
      
      if (formMode === 'create') {
        await createMenuItem(itemData);
        toast.success('Menu item created successfully');
      } else if (formMode === 'edit' && currentItem) {
        await updateMenuItem(currentItem._id, itemData);
        toast.success('Menu item updated successfully');
      }
      
      // Refresh menu data from database after successful operation
      refreshMenuData();
      
      handleCloseDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to save menu item'),
        severity: 'error'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentItem) return;
    
    try {
      setLoading(true);
      await deleteMenuItem(currentItem._id);
      toast.success('Menu item deleted successfully');
      
      // Refresh menu data after deletion
      refreshMenuData();
      handleCloseDeleteDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to delete menu item'),
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

  const getCategoryName = (categoryId) => {
    if (!categories) return 'Loading...';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (loadingMenu && (!menuItems || menuItems.length === 0)) {
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
          Menu Items Management
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
            Add Item
          </Button>
        </Box>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      {/* Use our new MenuItemTable component */}
      <MenuItemTable 
        menuItems={menuItems} 
        onEdit={handleOpenEditDialog} 
        onDelete={handleOpenDeleteDialog}
        getCategoryName={getCategoryName}
      />

      {/* Use our new MenuItemForm component */}
      <MenuItemForm 
        open={openDialog}
        onClose={handleCloseDialog}
        formMode={formMode}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        categories={categories}
        imagePreview={imagePreview}
        imageFile={imageFile}
        onImageChange={handleImageChange}
        onClearImage={handleClearImage}
      />

      {/* Use our new DeleteConfirmationDialog component */}
      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        itemName={currentItem?.name}
        loading={loading}
      />

      {/* Notification Snackbar */}
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

export default ItemManager;
