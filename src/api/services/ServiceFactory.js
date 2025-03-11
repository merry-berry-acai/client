import CategoryService from './categoryService';
import MenuService from './menuService';
import ToppingService from './toppingService';
import UserService from './userService'; // Assuming userService exists
import CheckoutService from './checkoutService';

class ServiceFactory {
  constructor() {
    this.services = {};
  }

  getService(serviceName) {
    if (!this.services[serviceName]) {
      switch (serviceName) {
        case 'categories':
          this.services[serviceName] = new CategoryService();
          break;
        case 'menuItems':
          this.services[serviceName] = new MenuService();
          break;
        case 'toppings':
          this.services[serviceName] = new ToppingService();
          break;
        case 'users':
          this.services[serviceName] = new UserService(); // Assuming userService exists
          break;
        case 'checkout':
          this.services[serviceName] = new CheckoutService();
          break;
        default:
          throw new Error('Unknown service: ' + serviceName);
      }
    }
    return this.services[serviceName];
  }
}

export default new ServiceFactory();
