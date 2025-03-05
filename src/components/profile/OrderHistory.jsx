import React, { useRef, useCallback } from 'react';
import { 
  Box, Card, CardContent, CardHeader, Typography,
  CircularProgress
} from '@mui/material';
import { Clock } from "lucide-react";

// Import components
import LoadingState from './order-history/LoadingState';
import ErrorState from './order-history/ErrorState';
import EmptyState from './order-history/EmptyState';
import OrderItem from './order-history/OrderItem';

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
              Showing {sortedOrders.length} of {totalOrderCount} orders
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
            <LoadingState />
          ) : error && !sortedOrders.length ? (
            <ErrorState error={error} onRetry={onRetry} />
          ) : (!sortedOrders || sortedOrders.length === 0) ? (
            <EmptyState />
          ) : (
            <>
              {sortedOrders.map((order, index) => {
                // Check if this is the last item to observe for infinite scrolling
                const isLastItem = index === sortedOrders.length - 1;
                
                return (
                  <OrderItem 
                    key={order._id || index}
                    order={order}
                    isExpanded={expandedOrder === order._id}
                    onToggle={toggleOrderExpansion}
                    onReorder={onReorder}
                    lastItemRef={isLastItem ? lastOrderRef : null}
                  />
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
