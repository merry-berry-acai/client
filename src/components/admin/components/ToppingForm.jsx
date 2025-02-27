import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControlLabel, Switch,
  CircularProgress, Grid
} from '@mui/material';

const ToppingForm = ({ 
  open, 
  onClose, 
  formMode, 
  formData, 
  onInputChange, 
  onSubmit, 
  loading 
}) => {
  const isEdit = formMode === 'edit';
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>
          {isEdit ? 'Edit Topping' : 'Add New Topping'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Topping Name"
                value={formData.name}
                onChange={onInputChange}
                fullWidth
                required
                autoFocus
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Price ($)"
                value={formData.price}
                onChange={onInputChange}
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={onInputChange}
                multiline
                rows={2}
                fullWidth
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={onInputChange}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Available"
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
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              bgcolor: 'purple',
              '&:hover': { bgcolor: 'darkviolet' }
            }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ToppingForm;
