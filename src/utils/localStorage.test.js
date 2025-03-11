import {
  storeUserPhoto,
  getUserPhoto,
  clearUserPhoto,
  storeWithExpiry,
  getWithExpiry,
  removeItem,
  getCartFromStorage,
  saveCartToStorage,
} from './localStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('storeUserPhoto', () => {
    it('should store user photo in localStorage', async () => {
      const mockPhotoURL = 'https://example.com/photo.jpg';
      const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
      const mockBase64Data = 'data:image/jpeg;base64,mockbase64data';

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        blob: vi.fn().mockResolvedValue(mockBlob),
      }));
      vi.stubGlobal('FileReader', vi.fn().mockImplementation(() => ({
        readAsDataURL: vi.fn(),
        onloadend: null,
        onerror: null,
        result: mockBase64Data,
      })));
      const fileReaderMock = new FileReader();

      const storeWithExpiryMock = vi.spyOn(
        require('./localStorage'),
        'storeWithExpiry'
      );

      await storeUserPhoto(mockPhotoURL);

      expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(mockPhotoURL);
      expect(fileReaderMock.readAsDataURL).toHaveBeenCalledWith(mockBlob);
      expect(storeWithExpiryMock).toHaveBeenCalledWith(
        'userPhotoCache',
        { url: mockPhotoURL, data: mockBase64Data },
        86400000
      );
    });
  });

  describe('getUserPhoto', () => {
    it('should get user photo from localStorage', () => {
      const mockBase64Data = 'data:image/jpeg;base64,mockbase64data';
      const mockPhotoCache = { data: mockBase64Data };
      const getWithExpiryMock = vi
        .spyOn(require('./localStorage'), 'getWithExpiry')
        .mockReturnValue(mockPhotoCache);

      const photo = getUserPhoto();

      expect(getWithExpiryMock).toHaveBeenCalledWith('userPhotoCache');
      expect(photo).toBe(mockBase64Data);
    });

    it('should return null if no user photo in localStorage', () => {
      const getWithExpiryMock = vi
        .spyOn(require('./localStorage'), 'getWithExpiry')
        .mockReturnValue(null);

      const photo = getUserPhoto();

      expect(getWithExpiryMock).toHaveBeenCalledWith('userPhotoCache');
      expect(photo).toBeNull();
    });
  });

  describe('clearUserPhoto', () => {
    it('should clear user photo from localStorage', () => {
      const removeItemMock = vi.spyOn(
        require('./localStorage'),
        'removeItem'
      );

      clearUserPhoto();

      expect(removeItemMock).toHaveBeenCalledWith('userPhotoCache');
    });
  });

  describe('storeWithExpiry', () => {
    it('should store data with expiry in localStorage', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };

      storeWithExpiry(key, mockData, 86400000);

      const storedItem = JSON.parse(localStorage.getItem(key));
      expect(storedItem.data).toEqual(mockData);
      expect(storedItem.expiry).toBeGreaterThan(Date.now());
    });

    it('should store data without expiry if expiryMs is null', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };

      storeWithExpiry(key, mockData, null);

      const storedItem = JSON.parse(localStorage.getItem(key));
      expect(storedItem.data).toEqual(mockData);
      expect(storedItem.expiry).toBeNull();
    });

    it('should handle localStorage error and return false', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = storeWithExpiry(key, mockData, 86400000);
      expect(result).toBe(false);
    });
  });

  describe('getWithExpiry', () => {
    it('should get data with expiry from localStorage', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };
      const mockItem = { data: mockData, expiry: Date.now() + 86400000, timestamp: Date.now() };
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockItem));

      const data = getWithExpiry(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(data).toEqual(mockData);
    });

    it('should return null if data is expired', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };
      const mockItem = { data: mockData, expiry: Date.now() - 1000, timestamp: Date.now() };
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockItem));
      vi.spyOn(localStorage, 'removeItem');

      const data = getWithExpiry(key);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
      expect(data).toBeNull();
    });

    it('should force refresh if cache is too old', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };
      const refreshThreshold = 30 * 60 * 1000; // 30 minutes
      const oldTimestamp = Date.now() - refreshThreshold - 1000; // Older than threshold
      const mockItem = { data: mockData, expiry: Date.now() + 86400000, timestamp: oldTimestamp };
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockItem));

      const data = getWithExpiry(key, true, refreshThreshold);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(data).toBeNull();
    });

    it('should not force refresh if cache is not too old', () => {
      const key = 'testKey';
      const mockData = { value: 'testValue' };
      const refreshThreshold = 30 * 60 * 1000; // 30 minutes
      const recentTimestamp = Date.now() - (refreshThreshold / 2); // More recent than threshold
      const mockItem = { data: mockData, expiry: Date.now() + 86400000, timestamp: recentTimestamp };
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockItem));

      const data = getWithExpiry(key, true, refreshThreshold);

      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(data).toEqual(mockData);
    });

    it('should return null if item not found', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      const data = getWithExpiry('nonExistentKey');

      expect(localStorage.getItem).toHaveBeenCalledWith('nonExistentKey');
      expect(data).toBeNull();
    });

    it('should handle localStorage error and return null', () => {
      const key = 'testKey';
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const data = getWithExpiry(key);
      expect(data).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      const key = 'testKey';
      vi.spyOn(localStorage, 'removeItem');

      removeItem(key);

      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should handle localStorage error and return false', () => {
      const key = 'testKey';
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = removeItem(key);
      expect(result).toBe(false);
    });
  });

  describe('getCartFromStorage', () => {
    it('should get cart from localStorage', () => {
      const mockCartItems = [{ _id: '1', name: 'Item 1', basePrice: 10, quantity: 1, cartItemId: 'cart-item-1' }];
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockCartItems));

      const cart = getCartFromStorage();

      expect(localStorage.getItem).toHaveBeenCalledWith('simple-cart');
      expect(cart).toEqual(mockCartItems);
    });

    it('should return empty array if cart is not in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      const cart = getCartFromStorage();

      expect(localStorage.getItem).toHaveBeenCalledWith('simple-cart');
      expect(cart).toEqual([]);
    });

    it('should handle localStorage error and return empty array', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const cart = getCartFromStorage();
      expect(cart).toEqual([]);
    });
  });

  describe('saveCartToStorage', () => {
    it('should save cart to localStorage', () => {
      const mockCartItems = [{ _id: '1', name: 'Item 1', basePrice: 10, quantity: 1, customization: [], cartItemId: 'cart-item-1' }];

      saveCartToStorage(mockCartItems);

      const storedCart = JSON.parse(localStorage.getItem('simple-cart'));
      expect(storedCart).toEqual(mockCartItems);
    });

    it('should handle localStorage error and return false', () => {
      const mockCartItems = [{ _id: '1', name: 'Item 1', basePrice: 10, quantity: 1, customization: [], cartItemId: 'cart-item-1' }];
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = saveCartToStorage(mockCartItems);
      expect(result).toBe(false);
    });
  });
});
