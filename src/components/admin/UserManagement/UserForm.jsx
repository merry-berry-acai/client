import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
  Box
} from '@mui/material';

const UserForm = ({ open, onClose, onSave, user, loading }) => {
  const initialFormState = {
    name: '',
    email: '',
    role: 'user',
    isActive: true,
    password: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true,
        password: '', // Don't pre-fill password for security
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Only include password if it's provided
      const userData = { ...formData };
      if (!userData.password) {
        delete userData.password;
      }
      onSave(userData);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label={user ? "Change Password (leave empty to keep current)" : "Password"}
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                required={!user}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Active Account"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              user ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
