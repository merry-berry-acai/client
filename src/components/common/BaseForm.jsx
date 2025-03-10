import React from 'react';
import AdminFormDialog from './AdminFormDialog';
import useApi from '../../hooks/useApi';

const BaseForm = ({
  open,
  onClose,
  formMode,
  title,
  onSubmit,
  children,
}) => {
  const isEdit = formMode === 'edit';
  const { loading } = useApi();

  return (
    <AdminFormDialog
      open={open}
      onClose={onClose}
      title={title}
      isEdit={isEdit}
      onSubmit={onSubmit}
      loading={loading}
    >
      {children}
    </AdminFormDialog>
  );
};

export default BaseForm;
