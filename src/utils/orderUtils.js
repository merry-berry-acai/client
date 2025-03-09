import { formatCurrency } from './formatters';

// Format the order ID to be more user-friendly
export const formatOrderId = (orderId) => {
  if (!orderId) return 'Unknown Order';
  return `Order #${orderId.substr(-4).toUpperCase()}`;
};

// Extract date from MongoDB ObjectID (first 4 bytes contain a timestamp)
export const extractDateFromOrderId = (orderId) => {
  if (!orderId || orderId.length < 8) return null;
  
  try {
    // Get the timestamp from the first 8 characters (4 bytes) of the ObjectId
    const timestamp = parseInt(orderId.substring(0, 8), 16);
    // Create a date from the timestamp (in seconds since epoch)
    const date = new Date(timestamp * 1000);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return null;
    
    return date;
  } catch (e) {
    console.error('Error extracting date from order ID:', e);
    appLogger.error('Error extracting date from order ID', e);
    return null;
  }
};

// Format the order date in a readable way
export const formatOrderDate = (orderId) => {
  const date = extractDateFromOrderId(orderId);
  
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate the total price of an order item including toppings
export const calculateItemTotal = (item) => {
  const basePrice = item.product?.basePrice || 0;
  const quantity = item.quantity || 1;
  
  // Calculate toppings total
  const toppingsTotal = Array.isArray(item.toppings)
    ? item.toppings.reduce((sum, topping) => {
        const toppingPrice = topping.product?.basePrice || 0;
        const toppingQuantity = topping.quantity || 1;
        return sum + (toppingPrice * toppingQuantity);
      }, 0)
    : 0;
  
  return (basePrice * quantity) + toppingsTotal;
};

// Calculate the total price of the entire order
export const calculateOrderTotal = (order) => {
  if (!order || !Array.isArray(order.items)) return 0;
  
  return order.items.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);
};

// Format order items for display
export const formatOrderItems = (items) => {
  if (!items || !Array.isArray(items)) return 'No items';
  if (items.length === 0) return 'No items';

  return items.map(item => {
    const name = item.product?.name || 'Unknown Item';
    const quantity = item.quantity || 1;
    return `${quantity}x ${name}`;
  }).join(', ');
};

// Format order items for adding to cart
export const prepareItemsForReorder = (items) => {
  if (!items || !Array.isArray(items)) return [];
  
  return items.map(item => ({
    _id: item.product?._id,
    name: item.product?.name,
    basePrice: item.product?.basePrice,
    category: item.product?.category,
    quantity: item.quantity || 1,
    customization: Array.isArray(item.toppings) 
      ? item.toppings.map(topping => ({
          _id: topping.product?._id,
          name: topping.product?.name,
          basePrice: topping.product?.basePrice,
          quantity: topping.quantity || 1
        }))
      : []
  }));
};
