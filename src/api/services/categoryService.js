import BaseService from './BaseService';

const ENDPOINT = '/categories';
const CACHE_KEY = 'categories';

class CategoryService extends BaseService {
  constructor() {
    super(ENDPOINT, CACHE_KEY);
  }

  getCategories = async (category = "") => {
    return this.get(category); 
  };

  createCategory = async (categoryData, authToken) => {
    return this.create(categoryData, authToken);
  };

  updateCategory = async (id, categoryData, authToken) => {
    return this.update(id, categoryData, authToken);
  };

  deleteCategory = async (id, authToken) => {
    return this.delete(id, authToken);
  };
}

export default new CategoryService();
