import { describe, test, expect, vi } from 'vitest';
import {

formatOrderId,
extractDateFromOrderId,
formatOrderDate,
calculateItemTotal,
calculateOrderTotal,
formatOrderItems,
prepareItemsForReorder
} from './orderUtils';

// Mock the formatters module
vi.mock('./formatters', () => ({
    formatCurrency: vi.fn(val => `$${val.toFixed(2)}`)
}));

describe('formatOrderId', () => {
    test('should format a valid order ID', () => {
        expect(formatOrderId('5f8d0f1e3a2b68a5e42d7c18')).toBe('Order #7C18');
    });

    test('should return a default value for undefined order ID', () => {
        expect(formatOrderId(undefined)).toBe('Unknown Order');
    }); 
});

describe('extractDateFromOrderId', () => {
    test('should extract date from a valid order ID', () => {
        const orderId = '5f8d0f1e3a2b68a5e42d7c18'; // Example ObjectId
        const expectedDate = new Date("2020-10-19T03:59:26.000Z");
        expect(extractDateFromOrderId(orderId)).toEqual(expectedDate);
    });

    test('should return null for invalid order ID format', () => {
        expect(extractDateFromOrderId('invalid-order-id')).toBeNull();
    });

    test('should return null for null order ID', () => {
        expect(extractDateFromOrderId(null)).toBeNull();
    });

    test('should return null for undefined order ID', () => {
        expect(extractDateFromOrderId(undefined)).toBeNull();
    });

    test('should return null for short order ID', () => {
        expect(extractDateFromOrderId('1234567')).toBeNull();
    });

    test('should return null for order ID with invalid timestamp', () => {
        const orderId = 'xxxxxxxxxxxxxxxxxxxxxxxx'; // Invalid timestamp
        const date = new Date('invalid date string'); // Create invalid Date object
        expect(extractDateFromOrderId(orderId)).toBeNull();
    });
});

describe('formatOrderDate', () => {
    test('should format date from a valid order ID', () => {
        const orderId = '5f8d0f1e3a2b68a5e42d7c18'; // Example ObjectId
        const date = extractDateFromOrderId(orderId);
        const expectedFormattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        expect(formatOrderDate(orderId)).toBe(expectedFormattedDate);
    });

    test('should return empty string for invalid order ID', () => {
        expect(formatOrderDate('invalid-order-id')).toBe('');
    });

    test('should return empty string for null order ID', () => {
        expect(formatOrderDate(null)).toBe('');
    });

    test('should return empty string for undefined order ID', () => {
        expect(formatOrderDate(undefined)).toBe('');
    });
});

describe('calculateItemTotal', () => {
    test('should calculate item total with no toppings', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 2
        };
        expect(calculateItemTotal(item)).toBe(20);
    });

    test('should calculate item total with toppings', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 2,
            toppings: [
                { product: { basePrice: 2 }, quantity: 1 },
                { product: { basePrice: 3 }, quantity: 2 }
            ]
        };
        expect(calculateItemTotal(item)).toBe(20 + 2 + 6); // 20 (item) + 2 (topping1) + 6 (topping2) = 28
    });

    test('should handle item with zero base price', () => {
        const item = {
            product: { basePrice: 0 },
            quantity: 3
        };
        expect(calculateItemTotal(item)).toBe(0);
    });

    test('should handle null product', () => {
        const item = {
            product: null,
            quantity: 2
        };
        expect(calculateItemTotal(item)).toBe(0);
    });

    test('should handle undefined product', () => {
        const item = {
            product: undefined,
            quantity: 2
        };
        expect(calculateItemTotal(item)).toBe(0);
    });

    test('should handle undefined quantity', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: undefined
        };
        expect(calculateItemTotal(item)).toBe(10); // quantity defaults to 1
    });

    test('should handle topping with zero base price', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 1,
            toppings: [
                { product: { basePrice: 0 }, quantity: 1 }
            ]
        };
        expect(calculateItemTotal(item)).toBe(10);
    });

    test('should handle null topping product', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 1,
            toppings: [
                { product: null, quantity: 1 }
            ]
        };
        expect(calculateItemTotal(item)).toBe(10);
    });

    test('should handle undefined topping product', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 1,
            toppings: [
                { product: undefined, quantity: 1 }
            ]
        };
        expect(calculateItemTotal(item)).toBe(10);
    });

    test('should handle undefined topping quantity', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 1,
            toppings: [
                { product: { basePrice: 2 }, quantity: undefined }
            ]
        };
        expect(calculateItemTotal(item)).toBe(12); // topping quantity defaults to 1
    });

    test('should handle non-array toppings', () => {
        const item = {
            product: { basePrice: 10 },
            quantity: 1,
            toppings: { product: { basePrice: 2 }, quantity: 1 } // toppings is an object, not array
        };
        expect(calculateItemTotal(item)).toBe(10); // should treat non-array toppings as no toppings
    });
});

describe('calculateOrderTotal', () => {
    test('should calculate order total for a valid order', () => {
        const order = {
            items: [
                { product: { basePrice: 10 }, quantity: 2 },
                { product: { basePrice: 5 }, quantity: 1, toppings: [{ product: { basePrice: 2 }, quantity: 1 }] }
            ]
        };
        expect(calculateOrderTotal(order)).toBe(20 + (5 + 2)); // 20 (item1) + 7 (item2) = 27
    });

    test('should return 0 for order with no items', () => {
        const order = { items: [] };
        expect(calculateOrderTotal(order)).toBe(0);
    });

    test('should return 0 for null order', () => {
        expect(calculateOrderTotal(null)).toBe(0);
    });

    test('should return 0 for undefined order', () => {
        expect(calculateOrderTotal(undefined)).toBe(0);
    });

    test('should return 0 for order with null items array', () => {
        const order = { items: null };
        expect(calculateOrderTotal(order)).toBe(0);
    });

    test('should return 0 for order with undefined items array', () => {
        const order = { items: undefined };
        expect(calculateOrderTotal(order)).toBe(0);
    });
});

describe('formatOrderItems', () => {
    test('should format order items correctly', () => {
        const items = [
            { product: { name: 'Coffee' }, quantity: 2 },
            { product: { name: 'Tea' }, quantity: 1 }
        ];
        expect(formatOrderItems(items)).toBe('2x Coffee, 1x Tea');
    });

    test('should return "No items" for empty items array', () => {
        expect(formatOrderItems([])).toBe('No items');
    });

    test('should return "No items" for null items', () => {
        expect(formatOrderItems(null)).toBe('No items');
    });

    test('should return "No items" for undefined items', () => {
        expect(formatOrderItems(undefined)).toBe('No items');
    });

    test('should handle items with null product', () => {
        const items = [
            { product: null, quantity: 1 }
        ];
        expect(formatOrderItems(items)).toBe('1x Unknown Item');
    });

    test('should handle items with undefined product', () => {
        const items = [
            { product: undefined, quantity: 1 }
        ];
        expect(formatOrderItems(items)).toBe('1x Unknown Item');
    });

    test('should handle items with undefined quantity', () => {
        const items = [
            { product: { name: 'Coffee' }, quantity: undefined }
        ];
        expect(formatOrderItems(items)).toBe('1x Coffee'); // quantity defaults to 1
    });
});

describe('prepareItemsForReorder', () => {
    test('should prepare items for reorder correctly', () => {
        const items = [
            { 
                product: { _id: '1', name: 'Coffee', basePrice: 10, category: 'Drinks' }, 
                quantity: 2,
                toppings: [
                    { product: { _id: '2', name: 'Milk', basePrice: 1, }, quantity: 1 }
                ]
            },
            { 
                product: { _id: '3', name: 'Tea', basePrice: 5, category: 'Drinks' }, 
                quantity: 1,
                toppings: [] 
            }
        ];
        const expectedPreparedItems = [
            {
                _id: '1',
                name: 'Coffee',
                basePrice: 10,
                category: 'Drinks',
                quantity: 2,
                customization: [
                    { _id: '2', name: 'Milk', basePrice: 1, quantity: 1 }
                ]
            },
            {
                _id: '3',
                name: 'Tea',
                basePrice: 5,
                category: 'Drinks',
                quantity: 1,
                customization: []
            }
        ];
        expect(prepareItemsForReorder(items)).toEqual(expectedPreparedItems);
    });

    test('should return empty array for empty items array', () => {
        expect(prepareItemsForReorder([])).toEqual([]);
    });

    test('should return empty array for null items', () => {
        expect(prepareItemsForReorder(null)).toEqual([]);
    });

    test('should return empty array for undefined items', () => {
        expect(prepareItemsForReorder(undefined)).toEqual([]);
    });

    test('should handle items with null product', () => {
        const items = [
            { product: null, quantity: 1 }
        ];
        expect(prepareItemsForReorder(items)).toEqual([
            {
                _id: undefined,
                name: undefined,
                basePrice: undefined,
                category: undefined,
                quantity: 1,
                customization: []
            }
        ]);
    });

    test('should handle items with undefined product', () => {
        const items = [
            { product: undefined, quantity: 1 }
        ];
        expect(prepareItemsForReorder(items)).toEqual([
            {
                _id: undefined,
                name: undefined,
                basePrice: undefined,
                category: undefined,
                quantity: 1,
                customization: []
            }
        ]);
    });

    test('should handle items with undefined quantity', () => {
        const items = [
            { product: { _id: '1', name: 'Coffee', basePrice: 10, category: 'Drinks' }, quantity: undefined }
        ];
        expect(prepareItemsForReorder(items)).toEqual([
            {
                _id: '1',
                name: 'Coffee',
                basePrice: 10,
                category: 'Drinks',
                quantity: 1,
                customization: []
            }
        ]); // quantity defaults to 1
    });

    test('should handle items with null toppings array', () => {
        const items = [
            { product: { _id: '1', name: 'Coffee', basePrice: 10, category: 'Drinks' }, quantity: 1, toppings: null }
        ];
        expect(prepareItemsForReorder(items)).toEqual([
            {
                _id: '1',
                name: 'Coffee',
                basePrice: 10,
                category: 'Drinks',
                quantity: 1,
                customization: [] // should treat null toppings as empty array
            }
        ]);
    });

    test('should handle items with undefined toppings array', () => {
        const items = [
            { product: { _id: '1', name: 'Coffee', basePrice: 10, category: 'Drinks' }, quantity: 1, toppings: undefined }
        ];
        expect(prepareItemsForReorder(items)).toEqual([
            {
                _id: '1',
                name: 'Coffee',
                basePrice: 10,
                category: 'Drinks',
                quantity: 1,
                customization: [] // should treat undefined toppings as empty array
            }
        ]);
    });
});
