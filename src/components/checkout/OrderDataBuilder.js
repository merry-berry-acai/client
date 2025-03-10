class OrderDataBuilder {
  constructor() {
    this.orderData = {
      items: [],
      totalPrice: 0
    };
  }

  setTotalPrice(totalPrice) {
    this.orderData.totalPrice = totalPrice;
    return this;
  }

  addCartItems(cartItems) {
    this.orderData.items = cartItems.map(item => this.buildOrderItem(item));
    return this;
  }

  buildOrderItem(item) {
    const orderItem = {
      product: item._id,
      quantity: item.quantity || 1,
      toppings: []
    };
    if (Array.isArray(item.customization)) {
      orderItem.toppings = item.customization.map(topping => ({
        product: topping._id,
        quantity: topping.quantity || 1
      }));
    }
    return orderItem;
  }

  build() {
    return this.orderData;
  }
}

export default OrderDataBuilder;
