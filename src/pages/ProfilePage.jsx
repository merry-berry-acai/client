import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Box } from '@mui/material';
import Layout from "../components/Layout";
import { AuthContext } from '../contexts/AuthContext';
import { getUserOrders } from '../api/apiHandler';
import { prepareItemsForReorder } from '../utils/orderUtils';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getCartFromStorage, saveCartToStorage } from '../utils/localStorage';

// Import the new components
import ProfileHeader from '../components/profile/ProfileHeader';
import OrderHistory from '../components/profile/OrderHistory';
import FavoriteDishes from '../components/profile/FavoriteDishes';
import SupportSection from '../components/profile/SupportSection';

// Number of orders to display per "page"
const ORDERS_PER_PAGE = 5;

const Profile = () => {
  const { currentUser, authToken } = useContext(AuthContext);
  const { showSuccess, showError } = useSnackbar();
  const [allOrders, setAllOrders] = useState([]); // All orders fetched from API
  const [displayedOrders, setDisplayedOrders] = useState([]); // Orders currently displayed
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [favorites] = useState([
    "Classic Açaí Bowl", 
    "Tropical Smoothie", 
    "Green Energy Smoothie", 
    "Protein Power Bowl"
  ]);

  // Sort orders once when they're fetched (most recent first)
  const sortedOrders = useMemo(() => {
    if (!allOrders || !Array.isArray(allOrders)) return [];
    
    return [...allOrders].sort((a, b) => {
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
  }, [allOrders]);

  // Fetch all orders once
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getUserOrders(currentUser.uid, authToken);
      setAllOrders(Array.isArray(data) ? data : []);
      
      // Initialize with first page of orders
      loadOrderPage(1, Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Error fetching orders:", err);
      Sentry.captureException(err, { 
        extra: { 
          action: "fetchAllOrders", 
          userId: currentUser.uid 
        } 
      });
      setError("Failed to load order history");
      setAllOrders([]);
      setDisplayedOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, authToken]);

  // Load a specific page of orders from the already fetched data
  const loadOrderPage = (pageNum, ordersSource = sortedOrders) => {
    const startIndex = 0;
    const endIndex = pageNum * ORDERS_PER_PAGE;
    
    // Get slice of orders for display
    const newlyDisplayed = ordersSource.slice(startIndex, endIndex);
    setDisplayedOrders(newlyDisplayed);
    
    // Check if there are more orders to load
    setHasMore(endIndex < ordersSource.length);
    setPage(pageNum);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllOrders();
  }, [currentUser.uid, fetchAllOrders]);

  // Handle loading more orders (infinite scroll)
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Simulate network delay for smoother UX
    setTimeout(() => {
      const nextPage = page + 1;
      loadOrderPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  const handleReorder = (items) => {
    try {
      const cartItems = prepareItemsForReorder(items);
      
      // Save to localStorage cart or dispatch to cart context
      const existingCart = getCartFromStorage();
      saveCartToStorage([...existingCart, ...cartItems]);
      
      // Show success message
      showSuccess('Items added to cart!');
    } catch (err) {
      console.error('Error re-ordering items:', err);
      Sentry.captureException(err, { 
        extra: { 
          action: "handleReorder"
        } 
      });
      showError('Failed to add items to cart');
    }
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: "#f9fafb", minHeight: "calc(100vh - 64px)" }}>
        <Container sx={{ py: 4 }}>
          {/* Profile Header */}
          <ProfileHeader />
          
          {/* Main Content */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, 
            gap: 4 
          }}>
            {/* Left Column - Order History with infinite scroll */}
            <OrderHistory 
              orders={displayedOrders} 
              loading={loading}
              loadingMore={loadingMore}
              error={error} 
              onRetry={fetchAllOrders}
              onReorder={handleReorder}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              totalOrderCount={sortedOrders.length}
            />

            {/* Right Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Favorite Dishes */}
              <FavoriteDishes favorites={favorites} />

              {/* Support */}
              <SupportSection />
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
