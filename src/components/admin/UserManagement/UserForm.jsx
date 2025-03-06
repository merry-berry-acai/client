import React, { useEffect, memo, useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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

// Validation schema moved outside component to prevent recreation on each render
const createUserValidationSchema = (isEditMode) => Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: isEditMode
    ? Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .nullable() // Allow empty for edit mode
    : Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  role: Yup.string()
    .oneOf(['user', 'staff', 'admin'], 'Invalid role')
    .required('Role is required'),
  isActive: Yup.boolean()
});

// Memoized form field component to prevent unnecessary re-renders
const FormikTextField = memo(({ field, form, label, ...props }) => {
  const errorText = form.touched[field.name] && form.errors[field.name];
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      {...field}
      {...props}
      error={!!errorText}
      helperText={errorText}
      disabled={props.disabled}
    />
  );
});

const UserForm = ({ open, onClose, onSave, user, loading }) => {
  const isEditMode = !!user;

  // Initial form values
  const initialValues = {
    name: user?.displayName || '',
    email: '',
    role: 'user',
    isActive: true,
    password: '',
  };
  
  // Use memoized validation schema to prevent recreating it on every render
  const validationSchema = useMemo(() => 
    createUserValidationSchema(isEditMode), 
    [isEditMode]
  );

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="sm" fullWidth>
      <Formik
        initialValues={user ? {
          displayName: user.displayName || '',
          email: user.email || '',
          role: user.role || 'user',
          isActive: user.isActive !== undefined ? user.isActive : true,
          password: '',
        } : initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // Remove password if empty in edit mode
          const userData = { ...values };
          if (isEditMode && !userData.password) {
            delete userData.password;
          }
          onSave(userData);
        }}
        enableReinitialize
        validateOnChange={false} // Only validate on blur and submit to reduce lag
        validateOnBlur={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    name="displayName"
                    label="Full Name"
                    component={FormikTextField}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    label="Email"
                    type="email"
                    component={FormikTextField}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="password"
                    label={user ? "Change Password (leave empty to keep current)" : "Password"}
                    type="password"
                    component={FormikTextField}
                    required={!user}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl 
                    fullWidth 
                    margin="normal" 
                    required
                    error={!!(touched.role && errors.role)}
                  >
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                    {touched.role && errors.role && (
                      <FormHelperText error>{errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isActive}
                        onChange={(e) => {
                          setFieldValue('isActive', e.target.checked);
                        }}
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
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default memo(UserForm);
