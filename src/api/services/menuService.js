import BaseService from './BaseService';

const ENDPOINT = '/items';
const CACHE_KEY = 'menuItems';

class MenuService extends BaseService {
  constructor() {
    super(ENDPOINT, CACHE_KEY);
  }

  getMenuItems = async () => {
    return this.get();
  };

  getFeaturedItems = async () => {
    return this.get('home/featured'); // Assuming 'home/featured' is the ID for featured items
  };

  getItemsInCategory = async (category) => {
    return this.get(`category/${category}`); // Assuming 'category/{category}' is the ID format
  };

  createMenuItem = async (itemData, authToken) => {
    return this.create(itemData, authToken);
  };

  updateMenuItem = async (id, itemData, authToken) => {
    return this.update(id, itemData, authToken);
  };

  deleteMenuItem = async (id, authToken) => {
    return this.delete(id, authToken);
  };
}

export default new MenuService();
