import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // adjust the path as needed
import { DashboardLayout } from '@toolpad/core'; // corrected import
import { Container, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PageContainer } from '@toolpad/core/PageContainer';

const AdminDashboard = ({children}) => {
  const navigation = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'admin',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      segment: 'admin/orders',
      title: 'Orders',
      icon: <ShoppingCartIcon />,
    },
  ];
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
    <DashboardLayout navigation={navigation}>
      
      <Container sx={{ py: 4 }}>
      <PageContainer>{children}</PageContainer>
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboard;
