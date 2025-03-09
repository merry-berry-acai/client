import React, { useContext } from 'react';
import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { CartProvider, CartContext } from "../contexts/CartContext";
import { MenuContext } from './MenuContext';

const mockMenuItems = [
    { _id: '1', name: 'Coffee', basePrice: 2 },
    { _id: '2', name: 'Tea', basePrice: 3 }
];

vi.mock('./MenuContext', () => ({
    MenuContext: {
        Consumer: ({ children }) => children({ menuItems: mockMenuItems }),
        Provider: ({ children }) => <>{children}</>,
        useContext: () => ({ menuItems: mockMenuItems }),
      }
}));

describe('CartContext', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    });

    test('should have correct initial state', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartTotal).toBe(0);
        expect(result.current.isCartOpen).toBe(false);
    });

    describe('addToCart', () => {
        test('should add item to cart', async () => {
            const { result } = renderHook(() => useContext(CartContext), { wrapper });
            const itemToAdd = { _id: '1', name: 'Coffee', basePrice: 2, quantity: 1 };

            await act(async () => {
                result.current.addToCart(itemToAdd);
            });

            expect(result.current.cartItems.length).toBe(1);
            expect(result.current.cartItems[0]).toMatchObject(itemToAdd);
            expect(result.current.cartItems[0]).toHaveProperty('cartItemId');
            expect(result.current.cartTotal).toBe(2);
        });

        test('should increase quantity if item already in cart', async () => {
            const { result } = renderHook(() => useContext(CartContext), { wrapper });
            const itemToAdd = { _id: '1', name: 'Coffee', basePrice: 2, quantity: 1, cartItemId: '123' };
            
            await act(async () => {
                result.current.addToCart(itemToAdd);
            });
            
            expect(result.current.cartItems).toEqual([itemToAdd]);

            const sameItemToAddAgain = { _id: '1', name: 'Coffee', basePrice: 2, quantity: 1, cartItemId: '123' };
            await act(async () => {
                result.current.addToCart(sameItemToAddAgain);
            });

            expect(result.current.cartItems).toEqual([{ ...itemToAdd, quantity: 2 }]);
            expect(result.current.cartTotal).toBe(4);
        });
    });

    describe('removeFromCart', () => {
        test('should remove item by cartItemId', async () => {
            const { result } = renderHook(() => useContext(CartContext), { wrapper });
            const itemToRemove = { _id: '1', name: 'Coffee', basePrice: 2, quantity: 2, cartItemId: '123' };
            
            await act(async () => {
                result.current.addToCart(itemToRemove);
            });
            
            expect(result.current.cartItems).toEqual([itemToRemove]);

            await act(async () => {
                result.current.removeFromCart(null, null, '123');
            });

            expect(result.current.cartItems).toEqual([]);
            expect(result.current.cartTotal).toBe(0);
        });
    });
});
