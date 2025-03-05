// User photo handling functions
export const storeUserPhoto = async (photoURL) => {
  if (photoURL) {
    try {
      const response = await fetch(photoURL);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result;
        localStorage.setItem('userPhotoData', base64data);
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error storing user photo:', error);
    }
  }
};

export const getUserPhoto = () => {
  return localStorage.getItem('userPhotoData');
};

export const clearUserPhoto = () => {
  localStorage.removeItem('userPhotoData');
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
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Failed to remove ${key} from localStorage:`, err);
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
    return [];
  }
};

export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('simple-cart', JSON.stringify(cartItems));
    return true;
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
    return false;
  }
};
