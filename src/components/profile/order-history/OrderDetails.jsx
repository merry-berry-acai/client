import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import { formatCurrency } from '../../../utils/formatters';

const OrderDetails = ({ items }) => {
  if (!items || !Array.isArray(items)) return null;
  
  return (
    <List dense disablePadding>
      {items.map((item, itemIndex) => (
        <ListItem 
          key={item._id || `item-${itemIndex}`} 
          sx={{ 
            py: 0.5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start' 
          }}
        >
          <ListItemText 
            primary={`${item.quantity}x ${item.product?.name || 'Unknown Item'}`}
            primaryTypographyProps={{ fontWeight: 'medium' }}
            secondary={
              <>
                {formatCurrency(item.product?.basePrice || 0)} each
                {item.toppings && item.toppings.length > 0 && (
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {item.toppings.map((topping, toppingIndex) => (
                      <Box component="li" key={topping._id || `topping-${toppingIndex}`}>
                        {topping.quantity}x {topping.product?.name || 'Unknown Topping'}
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default OrderDetails;
