import React from 'react';
import {
  TextField, FormControlLabel, Switch,
  Grid
} from '@mui/material';
import BaseForm from '../../common/BaseForm';

const ToppingForm = ({
  open,
  onClose,
  formMode,
  formData,
  onInputChange,
  onSubmit,
}) => {
  const isEdit = formMode === 'edit';

  return (
    <BaseForm
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Topping' : 'Add New Topping'}
      formMode={formMode}
      onSubmit={onSubmit}
    >
      <Grid item xs={12}>
        <TextField
          name="name"
          label="Topping Name"
          value={formData.name}
          onChange={onInputChange}
          fullWidth
          required
          autoFocus
          disabled={false}
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
          disabled={false}
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
              disabled={false}
            />
          }
          label="Available"
        />
      </Grid>
    </BaseForm>
  );
};

export default ToppingForm;
