import BaseService from './BaseService';

const ENDPOINT = '/checkout'; // Or your checkout endpoint

class CheckoutService extends BaseService {
  constructor() {
    super(ENDPOINT); // No cache key for checkout service
  }

  async processPayment(paymentData, authToken) { // add authToken param
    return this.apiCall('post', '/payment', paymentData, true, authToken); // Example payment processing endpoint, pass authToken
  }

  async createOrder(orderData, authToken) {
    return this.apiCall('post', '/orders/new', orderData, true, authToken); // Create order endpoint
  }

  async createPaymentIntent(paymentData, authToken) {
    return this.apiCall('post', '/payment', paymentData, true, authToken); // Create payment intent endpoint
  }

  async storePaymentConfirmation(paymentData, authToken) {
    return this.apiCall('post', '/checkout/payment/store', paymentData, true, authToken); // Store payment confirmation endpoint
  }
}

export default new CheckoutService();
