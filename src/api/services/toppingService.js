import BaseService from './BaseService';

const ENDPOINT = '/toppings';
const CACHE_KEY = 'toppings';

class ToppingService extends BaseService {
  constructor() {
    super(ENDPOINT, CACHE_KEY);
  }

  getToppings = async () => {
    return this.get();
  };

  createTopping = async (toppingData, authToken) => {
    return this.create(toppingData, authToken);
  };

  updateTopping = async (id, toppingData, authToken) => {
    return this.update(id, toppingData, authToken);
  };

  deleteTopping = async (id, authToken) => {
    return this.delete(id, authToken);
  };
}

export default new ToppingService();
