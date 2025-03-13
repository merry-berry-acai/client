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

const categoryService = new CategoryService()

export default CategoryService

export const getCategories = categoryService.getCategories.bind(categoryService);
export const createCategory = categoryService.createCategory.bind(categoryService);
export const updateCategory = categoryService.updateCategory.bind(categoryService);
export const deleteCategory = categoryService.deleteCategory.bind(categoryService);
