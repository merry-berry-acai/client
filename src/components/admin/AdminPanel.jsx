import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Typography, 
  Divider,
  Grid
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';

import { UserManagement } from './UserManagement';
import ApiDebugProvider from './common/ApiDebugProvider';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ApiDebugProvider>
      <Container maxWidth="xl">
        <Paper sx={{ mt: 3, mb: 4, p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your application's users, products, and settings.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="admin panel tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<DashboardIcon />} label="Dashboard" />
              <Tab icon={<PeopleAltIcon />} label="User Management" />
              <Tab icon={<CategoryIcon />} label="Products" />
              <Tab icon={<SettingsIcon />} label="Settings" />
            </Tabs>
          </Box>
          
          <Box sx={{ py: 3 }}>
            {activeTab === 0 && (
              <Typography variant="h6">Dashboard Content</Typography>
            )}
            {activeTab === 1 && (
              <UserManagement />
            )}
            {activeTab === 2 && (
              <Typography variant="h6">Products Content</Typography>
            )}
            {activeTab === 3 && (
              <Typography variant="h6">Settings Content</Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </ApiDebugProvider>
  );
};

export default AdminPanel;
