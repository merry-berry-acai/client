import { userSchema, menuItemSchema, toppingSchema, categorySchema } from './validationSchemas';

describe('validationSchemas', () => {
  describe('userSchema', () => {
    it('should validate valid user data', async () => {
      const validUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
      };
      await expect(userSchema().validate(validUserData)).resolves.toEqual(validUserData);
    });

    it('should validate valid user data in edit mode without password', async () => {
      const validUserData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
      };
      await expect(userSchema(true).validate(validUserData)).resolves.toEqual(validUserData);
    });

    it('should invalidate user data with missing fields', async () => {
      const invalidUserData = {};
      await expect(userSchema().validate(invalidUserData)).rejects.toThrowError();
    });

    it('should invalidate user data with invalid email', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'user',
        isActive: true,
      };
      await expect(userSchema().validate(invalidUserData)).rejects.toThrowError('Invalid email address');
    });

    it('should invalidate user data with short password', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'short',
        role: 'user',
        isActive: true,
      };
      await expect(userSchema().validate(invalidUserData)).rejects.toThrowError('Password must be at least 8 characters');
    });

    it('should invalidate user data with invalid role', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid-role',
        isActive: true,
      };
      await expect(userSchema().validate(invalidUserData)).rejects.toThrowError('Invalid role');
    });
  });

  describe('menuItemSchema', () => {
    it('should validate valid menu item data', async () => {
      const validMenuItemData = {
        name: 'Test Item',
        description: 'Test description',
        basePrice: 10,
        categoryId: 'test-category',
        isAvailable: true,
        isFeatured: false,
      };
      await expect(menuItemSchema.validate(validMenuItemData)).resolves.toEqual(validMenuItemData);
    });

    it('should invalidate menu item data with missing fields', async () => {
      const invalidMenuItemData = {};
      await expect(menuItemSchema.validate(invalidMenuItemData)).rejects.toThrowError();
    });

    it('should invalidate menu item data with invalid price', async () => {
      const invalidMenuItemData = {
        name: 'Test Item',
        basePrice: -1,
        categoryId: 'test-category',
      };
      await expect(menuItemSchema.validate(invalidMenuItemData)).rejects.toThrowError('Price must be positive');
    });
  });

  describe('toppingSchema', () => {
    it('should validate valid topping data', async () => {
      const validToppingData = {
        name: 'Test Topping',
        price: 1,
        description: 'Test description',
        isAvailable: true,
      };
      await expect(toppingSchema.validate(validToppingData)).resolves.toEqual(validToppingData);
    });

    it('should invalidate topping data with missing fields', async () => {
      const invalidToppingData = {};
      await expect(toppingSchema.validate(invalidToppingData)).rejects.toThrowError();
    });

    it('should invalidate topping data with negative price', async () => {
      const invalidToppingData = {
        name: 'Test Topping',
        price: -1,
      };
      await expect(toppingSchema.validate(invalidToppingData)).rejects.toThrowError('Price cannot be negative');
    });
  });

  describe('categorySchema', () => {
    it('should validate valid category data', async () => {
      const validCategoryData = {
        name: 'Test Category',
        description: 'Test description',
        isActive: true,
      };
      await expect(categorySchema.validate(validCategoryData)).resolves.toEqual(validCategoryData);
    });

    it('should invalidate category data with missing fields', async () => {
      const invalidCategoryData = {};
      await expect(categorySchema.validate(invalidCategoryData)).rejects.toThrowError();
    });
  });
});
