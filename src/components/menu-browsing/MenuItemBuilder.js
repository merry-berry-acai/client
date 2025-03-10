class MenuItemBuilder {
  constructor(baseItem) {
    this.item = { ...baseItem }; // Start with a base menu item
    this.customizations = [];
  }

  addItemProperty(key, value) {
    this.item[key] = value;
    return this; // Make it chainable
  }

  addCustomization(customization) {
    this.customizations.push(customization);
    return this; // For chaining
  }

  resetCustomizations() {
    this.customizations = [];
    return this;
  }

  build() {
    const customizedItem = { ...this.item };
    if (this.customizations.length > 0) {
      customizedItem.customizations = [...this.customizations];
    }
    return customizedItem;
  }
}

export default MenuItemBuilder;
