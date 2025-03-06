import * as Yup from 'yup';

// User validation schema
export const userSchema = (isEditMode = false) => Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: isEditMode
    ? Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .nullable()
    : Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  role: Yup.string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('Role is required'),
  isActive: Yup.boolean()
});

// Menu item validation schema
export const menuItemSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
  basePrice: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  categoryId: Yup.string()
    .required('Category is required'),
  isAvailable: Yup.boolean(),
  isFeatured: Yup.boolean()
});

// Topping validation schema
export const toppingSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  description: Yup.string(),
  isAvailable: Yup.boolean()
});

// Category validation schema
export const categorySchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
  isActive: Yup.boolean()
});
