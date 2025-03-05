import React from 'react';
import { 
  Box, Typography, Button, Chip, Collapse, Paper
} from '@mui/material';
import { ChevronUp, ChevronDown, RefreshCw, Calendar } from "lucide-react";
import { formatCurrency } from '../../../utils';
import { 
  formatOrderId, 
  calculateOrderTotal,
  formatOrderItems,
  formatOrderDate
} from '../../../utils';
import { toTitleCase } from '../../../utils/textFormatters';
import { OrderDetails } from '../order-history';

const OrderItem = ({ order, isExpanded, onToggle, onReorder, lastItemRef }) => {
  const orderDate = formatOrderDate(order._id);
  
  const handleReorder = (e) => {
    e.stopPropagation();
    if (onReorder && order.items) {
      onReorder(order.items);
    }
  };

  return (
    <Paper
      elevation={0}
      ref={lastItemRef}
      sx={{ 
        mb: 2, 
        p: 2, 
        borderRadius: 1,
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Box>
        {/* Order Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer'
            }}
            onClick={() => onToggle(order._id)}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              {formatOrderId(order._id)}
            </Typography>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshCw size={14} />}
              onClick={handleReorder}
              sx={{ 
                color: 'purple',
                borderColor: 'purple',
                '&:hover': { 
                  bgcolor: 'rgba(128, 0, 128, 0.08)',
                  borderColor: 'darkviolet' 
                }
              }}
            >
              Re-order
            </Button>
            <Chip 
              label={order.status ? toTitleCase(order.status) : "Completed"} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(128, 0, 128, 0.1)', 
                color: 'purple',
                fontWeight: 'medium'
              }} 
            />
          </Box>
        </Box>
        
        {/* Order Date */}
        {orderDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Calendar size={12} color="grey" />
            <Typography variant="caption" color="text.secondary">
              {orderDate}
            </Typography>
          </Box>
        )}
        
        {/* Brief Order Summary */}
        <Typography variant="body2" mt={1}>
          {formatOrderItems(order.items)}
        </Typography>
        <Typography variant="subtitle2" mt={1} fontWeight="medium">
          Total: {formatCurrency(calculateOrderTotal(order))}
        </Typography>
        
        {/* Expanded Order Details */}
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, mb: 1, pl: 2, borderLeft: '2px solid rgba(128, 0, 128, 0.2)' }}>
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              Order Details
            </Typography>
            <OrderDetails items={order.items} />
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default OrderItem;
