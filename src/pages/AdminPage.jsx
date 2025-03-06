import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, List, 
  ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Layout from '../components/Layout';
import ItemManager from '../components/admin/ItemManager';
import CategoryManager from '../components/admin/CategoryManager';
import ToppingManager from '../components/admin/ToppingManager';
import { UserManagement } from '../components/admin/UserManagement';
import EducatorNote from '../components/EducatorNote';
import ApiDebugProvider from '../components/admin/common/ApiDebugProvider';
import ApiDebugPanel, { useApiDebug } from '../components/admin/common/ApiDebugPanel';

// Wrap the component content to access the debug context
const AdminPageContent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { debugMode } = useApiDebug();

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  // Create array of tab content components
  const tabContent = [
    <ItemManager key="items" />,
    <CategoryManager key="categories" />,
    <ToppingManager key="toppings" />,
    <UserManagement key="users" />
  ];

  return (
    <Layout>
      <Box sx={{ bgcolor: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'purple' }}>
              Admin Dashboard
            </Typography>
            <Box>
              <ApiDebugPanel />
            </Box>
          </Box>
          
          {/* Educator Note */}
          <EducatorNote sx={{ mb: 3 }}>
            <Typography variant="body2">
              This admin panel demonstrates role-based access control. Use the admin account 
              (admin@merry-berry.com.au / admin123) to explore all administrative features. Regular user accounts 
              will be redirected if they attempt to access this page directly.
            </Typography>
          </EducatorNote>
          
          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid item xs={12} md={3} lg={2}>
              <Paper 
                sx={{ 
                  borderRadius: 2, 
                  height: '100%',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
                }}
              >
                <List component="nav" aria-label="admin navigation">
                  <ListItem 
                    button 
                    selected={activeTab === 0}
                    onClick={() => handleTabChange(0)}
                    sx={{ 
                      borderLeft: activeTab === 0 ? '4px solid purple' : '4px solid transparent',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <RestaurantMenuIcon color={activeTab === 0 ? 'secondary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Menu Items" 
                      primaryTypographyProps={{ 
                        fontWeight: activeTab === 0 ? 600 : 400,
                        color: activeTab === 0 ? 'purple' : 'inherit' 
                      }} 
                    />
                  </ListItem>
                  
                  <ListItem 
                    button 
                    selected={activeTab === 1}
                    onClick={() => handleTabChange(1)}
                    sx={{ 
                      borderLeft: activeTab === 1 ? '4px solid purple' : '4px solid transparent',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <CategoryIcon color={activeTab === 1 ? 'secondary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Categories" 
                      primaryTypographyProps={{ 
                        fontWeight: activeTab === 1 ? 600 : 400,
                        color: activeTab === 1 ? 'purple' : 'inherit' 
                      }} 
                    />
                  </ListItem>
                  
                  <ListItem 
                    button 
                    selected={activeTab === 2}
                    onClick={() => handleTabChange(2)}
                    sx={{ 
                      borderLeft: activeTab === 2 ? '4px solid purple' : '4px solid transparent',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LocalPizzaIcon color={activeTab === 2 ? 'secondary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Toppings" 
                      primaryTypographyProps={{ 
                        fontWeight: activeTab === 2 ? 600 : 400,
                        color: activeTab === 2 ? 'purple' : 'inherit' 
                      }} 
                    />
                  </ListItem>
                  
                  <ListItem 
                    button 
                    selected={activeTab === 3}
                    onClick={() => handleTabChange(3)}
                    sx={{ 
                      borderLeft: activeTab === 3 ? '4px solid purple' : '4px solid transparent',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PeopleAltIcon color={activeTab === 3 ? 'secondary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Users" 
                      primaryTypographyProps={{ 
                        fontWeight: activeTab === 3 ? 600 : 400,
                        color: activeTab === 3 ? 'purple' : 'inherit' 
                      }} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12} md={9} lg={10}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  minHeight: '70vh',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
                }}
              >
                {/* Dynamic content based on selected tab */}
                {tabContent[activeTab]}
              </Paper>
            </Grid>
          </Grid>
          
          {/* Debug panel for API logs */}
          {debugMode && (
            <Box sx={{ mt: 3 }}>
              <ApiDebugPanel />
            </Box>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

// Wrap with ApiDebugProvider
const AdminPage = () => (
  <ApiDebugProvider>
    <AdminPageContent />
  </ApiDebugProvider>
);

export default AdminPage;
