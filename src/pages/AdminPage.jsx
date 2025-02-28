import React, { useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, List, 
  ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import Layout from '../components/Layout';
import ItemManager from '../components/admin/ItemManager';
import CategoryManager from '../components/admin/CategoryManager';
import ToppingManager from '../components/admin/ToppingManager';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  // Create array of tab content components
  const tabContent = [
    <ItemManager key="items" />,
    <CategoryManager key="categories" />,
    <ToppingManager key="toppings" />
  ];

  return (
    <Layout>
      <Box sx={{ bgcolor: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'purple', mb: 4 }}>
            Admin Dashboard
          </Typography>
          
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
        </Container>
      </Box>
    </Layout>
  );
};

export default AdminPage;
