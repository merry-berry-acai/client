import React, { useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Box, Card, CardContent, CardHeader, Typography,
  Chip, Button, Divider, List, ListItem, ListItemText, Collapse,
  Paper, CircularProgress
} from '@mui/material';
import { Clock, ChevronDown, ChevronUp, RefreshCw, Calendar } from "lucide-react";
import { formatCurrency } from '../../utils/formatters';
import { 
  formatOrderId, 
  calculateOrderTotal,
  formatOrderItems,
  formatOrderDate
} from '../../utils/orderUtils';

const OrderHistory = ({ 
  orders, 
  loading, 
  loadingMore, 
  error, 
  onRetry, 
  onReorder, 
  hasMore, 
  onLoadMore,
  totalOrderCount 
}) => {
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = React.useState(null);
  const observerRef = useRef();
  
  // Sort orders to display latest first
  const sortedOrders = React.useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return [...orders].sort((a, b) => {
      // If there's a createdAt field, use it
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // As a fallback, use the _id (assuming MongoDB IDs which contain a timestamp)
      else if (a._id && b._id) {
        return b._id.localeCompare(a._id);
      }
      return 0; // keep original order if no sort criteria
    });
  }, [orders]);
  
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const handleReorder = (order, e) => {
    e.stopPropagation(); // Prevent the expansion toggle
    if (onReorder && order.items) {
      onReorder(order.items);
    }
  };
  
  // Setup the intersection observer for infinite scrolling
  const lastOrderRef = useCallback(node => {
    if (loading || loadingMore) return;
    
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create a new observer
    observerRef.current = new IntersectionObserver(entries => {
      // Check if the last element is visible and there are more items to load
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { threshold: 0.5 });
    
    // Observe the last element
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, loadingMore, hasMore, onLoadMore]);
  
  const renderOrderItems = (items) => {
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
  
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={20} color="purple" />
            <Typography variant="h6">Order History</Typography>
          </Box>
        }
        action={
          totalOrderCount > 0 && !loading && (
            <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
              Showing {orders.length} of {totalOrderCount} orders
            </Typography>
          )
        }
        sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      />
      
      {/* Make the content area scrollable with a fixed height */}
      <Box
        sx={{
          maxHeight: {
            xs: '400px', // Smaller height on mobile
            sm: '500px'  // Larger on desktop
          },
          overflow: 'auto',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(128, 0, 128, 0.2)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(128, 0, 128, 0.3)',
            },
          },
        }}
      >
        <CardContent sx={{ pb: 1 }}> {/* Reduce bottom padding since we have scrollable content */}
          {loading && !sortedOrders.length ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Loading order history...</Typography>
            </Box>
          ) : error && !sortedOrders.length ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="error">{error}</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2, color: 'purple', borderColor: 'purple' }}
                onClick={onRetry}
              >
                Try Again
              </Button>
            </Box>
          ) : (!sortedOrders || sortedOrders.length === 0) ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">No orders yet</Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2,
                  bgcolor: 'purple',
                  '&:hover': { bgcolor: 'darkviolet' }
                }}
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <>
              {sortedOrders.map((order, index) => {
                // Check if this is the last item to observe for infinite scrolling
                const isLastItem = index === sortedOrders.length - 1;
                const orderDate = formatOrderDate(order._id);
                
                return (
                  <Paper
                    key={order._id || index} 
                    elevation={0}
                    ref={isLastItem ? lastOrderRef : null}
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.06)',
                      '&:last-child': { mb: loadingMore ? 2 : 0 }
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
                          onClick={() => toggleOrderExpansion(order._id)}
                        >
                          <Typography variant="subtitle1" fontWeight="medium">
                            {formatOrderId(order._id)}
                          </Typography>
                          {expandedOrder === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RefreshCw size={14} />}
                            onClick={(e) => handleReorder(order, e)}
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
                            label={order.status || "Completed"} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(128, 0, 128, 0.1)', 
                              color: 'purple',
                              fontWeight: 'medium'
                            }} 
                          />
                        </Box>
                      </Box>
                      
                      {/* Order Date - New! */}
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
                      <Collapse in={expandedOrder === order._id}>
                        <Box sx={{ mt: 2, mb: 1, pl: 2, borderLeft: '2px solid rgba(128, 0, 128, 0.2)' }}>
                          <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                            Order Details
                          </Typography>
                          {renderOrderItems(order.items)}
                        </Box>
                      </Collapse>
                    </Box>
                  </Paper>
                );
              })}

              {/* Loading indicator for infinite scroll */}
              {loadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ color: 'purple' }} />
                </Box>
              )}
              
              {/* End of list message */}
              {!hasMore && sortedOrders.length > 0 && !loadingMore && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    End of order history
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default OrderHistory;
