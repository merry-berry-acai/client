import React from 'react';
import { ListItem, ListItemText, Typography, Paper } from '@mui/material';

const CartItem = ({ item, variant }) => {
  const customisationText = Array.isArray(item.customization)
    ? item.customization.map(t => t.name).join(', ')
    : item.customization;

  if (variant === 'dropdown') {
    return (
      <ListItem>
        <ListItemText
          primary={item.name}
          secondary={customisationText ? `Customisation: ${customisationText}` : null}
        />
      </ListItem>
    );
  }
  return (
    <Paper style={{ padding: 16, marginBottom: 8 }} elevation={2}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <img 
          src={item.image} 
          alt={item.name} 
          style={{ width: '120px', height: 'auto', borderRadius: 8 }} 
        />
        <div>
          <Typography variant="h6" style={{ marginBottom: 8 }}>{item.name}</Typography>
          {customisationText && (
            <ul>
              {Array.isArray(item.customization)
                ? item.customization.map(t => (
                    <li key={t.id}>{t.name}</li>
                  ))
                : <li>{item.customization}</li>}
            </ul>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default CartItem;
