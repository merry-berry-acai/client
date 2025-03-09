// User photo handling functions
export const storeUserPhoto = async (photoURL) => {
  if (photoURL) {
    try {
      // Check if we already have this photo URL cached
      const currentPhotoData = getWithExpiry('userPhotoCache');
      if (currentPhotoData && currentPhotoData.url === photoURL) {
        // Photo URL hasn't changed, no need to re-fetch
        return;
      }
      
      const response = await fetch(photoURL);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          // Store with 24 hour expiry (86400000 ms)
          storeWithExpiry('userPhotoCache', {
            url: photoURL,
            data: base64data
          }, 86400000); 
          resolve();
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error storing user photo:', error);
      appLogger.error('Error storing user photo', error);
    }
  }
};

export const getUserPhoto = () => {
  const photoCache = getWithExpiry('userPhotoCache');
  return photoCache ? photoCache.data : null;
};

export const clearUserPhoto = () => {
  removeItem('userPhotoCache');
};

// Generic localStorage handlers with caching support
export const storeWithExpiry = (key, data, expiryMs = null) => {
  try {
    const item = {
      data,
      timestamp: new Date().getTime(),
      expiry: expiryMs ? new Date().getTime() + expiryMs : null
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (err) {
    console.error(`Failed to store ${key} in localStorage:`, err);
    appLogger.error(`Failed to store ${key} in localStorage`, err);
    return false;
  }
};

export const getWithExpiry = (key, forceRefresh = false, refreshThreshold = null) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Handle force refresh with threshold
    if (forceRefresh && refreshThreshold && (now - item.timestamp > refreshThreshold)) {
      console.log(`Force refreshing ${key}, cache too old (${Math.round((now - item.timestamp)/1000/60)} minutes)`);
      return null;
    }
    
    // Check if item is expired
    if (item.expiry && now > item.expiry) {
      console.log(`Cache expired for ${key}`);
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data;
  } catch (err) {
    console.error(`Failed to retrieve ${key} from localStorage:`, err);
    appLogger.error(`Failed to retrieve ${key} from localStorage`, err);
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Failed to remove ${key} from localStorage:`, err);
    appLogger.error(`Failed to remove ${key} from localStorage`, err);
    return false;
  }
};

// Cart-specific utility functions
export const getCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('simple-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    console.error("Failed to load cart from localStorage:", err);
    appLogger.error("Failed to load cart from localStorage", err);
    return [];
  }
};

export const saveCartToStorage = (cartItems) => {
  try {
    // Store only essential cart data, images will be retrieved from menu context
    const minimalItems = cartItems.map(item => ({
      _id: item._id,
      name: item.name,
      basePrice: item.basePrice,
      quantity: item.quantity || 1,
      customization: item.customization || [],
      cartItemId: item.cartItemId
    }));
    
    localStorage.setItem('simple-cart', JSON.stringify(minimalItems));
    return true;
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
    appLogger.error("Failed to save cart to localStorage", err);
    return false;
  }
};
