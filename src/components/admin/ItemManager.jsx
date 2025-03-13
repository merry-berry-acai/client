import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, Typography, Paper, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { MenuContext } from '../../contexts/MenuContext';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../api/apiHandler';
import { toast } from 'react-toastify';
import ServiceFactory from '../../api/services/ServiceFactory';
import { AuthContext } from '../../contexts/AuthContext';

// Import our components using barrel files
import { 
  MenuItemTable, 
  MenuItemForm, 
  DeleteConfirmationDialog 
} from './components';

const ItemManager = () => {
  const { menuItems, categories, refreshMenuData, loadingMenu } = useContext(MenuContext);
  const { authToken } = useContext(AuthContext);
  
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
    // Extract the categoryId correctly based on API response structure
    // The API might return category as an object with _id or as a string ID
    const categoryId = item.category?._id || item.category || item.categoryId || '';
    
    setFormData({
      name: item.name || '',
      description: item.description || '',
      basePrice: item.basePrice ? item.basePrice.toString() : '',
      categoryId: categoryId,
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
      
      // Transform the data to match the API expectations
      const itemData = {
        ...formData,
        basePrice: basePrice,
        // Rename categoryId to category for the API
        category: formData.categoryId,
      };
      
      // Remove the original categoryId field
      delete itemData.categoryId;
      
      // Handle image differently for create vs edit modes
      if (formMode === 'create') {
        // For new items, set placeholder if no image and no URL provided
        if (!itemData.image && !imageFile) {
          itemData.image = 'https://via.placeholder.com/300x200?text=No+Image';
        }
      } else if (formMode === 'edit') {
        // For edit mode, handle image updates properly
        if (!imageFile && formData.image === currentItem.image) {
          // If using the original image (no changes), don't include the image field
          // to avoid unnecessary updates
          delete itemData.image;
        }
        // Otherwise, the new URL from formData.image will be sent
      }
      const menuService = ServiceFactory.getService('menuItems');
      
      if (formMode === 'create') {
        await menuService.createMenuItem(itemData, authToken);
        toast.success('Menu Item created successfully');
      } else if (formMode === 'edit' && currentItem) {
        await menuService.updateMenuItem(currentItem._id, itemData, authToken);
        toast.success('Menu Item updated successfully');
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
      const menuService = ServiceFactory.getService('menuItems');
      console.log("authToken:", authToken); // Log authToken here
      await menuService.deleteMenuItem(currentItem._id, authToken);
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
    
    // Handle both cases: category might be an ID string or an object with _id
    const id = typeof categoryId === 'object' ? categoryId._id : categoryId;
    
    const category = categories.find(cat => cat._id === id);
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
        menuItems={menuItems.map(item => ({
          ...item,
          // Ensure categoryId is available in the expected format for the table component
          categoryId: item.category?._id || item.category || item.categoryId
        }))} 
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
