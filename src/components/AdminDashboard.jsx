import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // adjust the path as needed
import { DashboardLayout } from '@toolpad/core'; // corrected import
import { Container, Box, Typography } from '@mui/material';

const AdminDashboard = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated || userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const CustomHeader = () => (
    <Box sx={{ p: 2, bgcolor: 'grey.900', color: 'white' }}>
      <Typography variant="h5">Merry Berry</Typography>
    </Box>
  );

  return (
    <DashboardLayout header={<CustomHeader />}>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <div className="min-h-screen bg-gray-100 p-8">
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboard;
