import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Box, Button, Typography, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { MenuContext } from '../../contexts/MenuContext';
import ServiceFactory from '../../api/services/ServiceFactory';
import { toast } from 'react-toastify';

// Import components using barrel files
import {
  CategoryTable,
  CategoryForm,
  DeleteConfirmationDialog
} from './components';

const CategoryManager = () => {
  const { categories, refreshMenuData, loadingMenu } = useContext(MenuContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });

  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setFormMode('create');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (category) => {
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== false
    });
    setCurrentCategory(category);
    setImagePreview(category.image || '');
    setImageFile(null);
    setFormMode('edit');
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (category) => {
    setCurrentCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentCategory(null);
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
    setFormData({ ...formData, image: '' });
  };

  const handleRefresh = () => {
    refreshMenuData();
    toast.info('Category data refreshed from database');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setNotification({
        open: true,
        message: 'Name is required',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);

      const categoryData = { ...formData };

      // Handle image upload (in a real app, you'd upload to cloud storage)
      if (!categoryData.image && !imageFile) {
        // Optional: Set a placeholder image
        categoryData.image = 'https://via.placeholder.com/300x200?text=No+Image';
      }

      const categoryService = ServiceFactory.getService('categories');
      

      if (formMode === 'create') {
        await categoryService.createCategory(categoryData);
        toast.success('Category created successfully');
      } else if (formMode === 'edit' && currentCategory) {
        await categoryService.updateCategory(currentCategory._id, categoryData);
        toast.success('Category updated successfully');
      }

      // Refresh data from database after successful operation
      refreshMenuData();
      handleCloseDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to save category'),
        severity: 'error'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      const categoryService = ServiceFactory.getService('categories');
      await categoryService.deleteCategory(currentCategory._id); // Pass authToken
      toast.success('Category deleted successfully');

      // Refresh data after deletion
      refreshMenuData();
      handleCloseDeleteDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error: ' + (err.message || 'Failed to delete category'),
        severity: 'error'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loadingMenu && (!categories || categories.length === 0)) {
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
          Category Management
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
            Add Category
          </Button>
        </Box>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <CategoryTable
        categories={categories}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
      />

      <CategoryForm
        open={openDialog}
        onClose={handleCloseDialog}
        formMode={formMode}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onClearImage={handleClearImage}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        itemName={currentCategory?.name}
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

export default CategoryManager;
