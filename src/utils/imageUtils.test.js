import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getFullImageUrl, getFallbackImageUrl } from './imageUtils';


// Reset any existing mocks before tests
beforeEach(() => {
    vi.resetModules();
});

describe('imageUtils', () => {
    describe('getFullImageUrl', () => {
        test('returns null for null or undefined input', () => {
            expect(getFullImageUrl(null)).toBeNull();
            expect(getFullImageUrl(undefined)).toBeNull();
        });

        test('returns null for object input', () => {
            expect(getFullImageUrl({})).toBeNull();
            expect(getFullImageUrl({ url: 'test.jpg' })).toBeNull();
        });

        test('returns the same URL for absolute URLs', () => {
            const httpUrl = 'http://example.com/image.jpg';
            const httpsUrl = 'https://example.com/image.jpg';
            
            expect(getFullImageUrl(httpUrl)).toBe(httpUrl);
            expect(getFullImageUrl(httpsUrl)).toBe(httpsUrl);
        });

        test('returns the same URL for data URLs', () => {
            const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';
            expect(getFullImageUrl(dataUrl)).toBe(dataUrl);
        });

        test('prepends API base URL to relative paths', () => {
            expect(getFullImageUrl('image.jpg')).toBe('http://localhost:3000/api/image.jpg');
            expect(getFullImageUrl('/image.jpg')).toBe('http://localhost:3000/api/image.jpg');
        });

        test('does not double prefix URLs that already include API base URL', () => {
            expect(getFullImageUrl('http://localhost:3000/api/image.jpg')).toBe('http://localhost:3000/api/image.jpg');
        });

        test('returns null and logs error when an exception occurs', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const badInput = { toString: () => { throw new Error('Test error') } };
            
            expect(getFullImageUrl(badInput)).toBeNull();
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
    });

    describe('getFallbackImageUrl', () => {
        test('returns default food image when no type is specified', () => {
            expect(getFallbackImageUrl()).toBe('/assets/default-food.png');
        });

        test('returns user image when type is "user"', () => {
            expect(getFallbackImageUrl('user')).toBe('/assets/default-user.png');
        });

        test('returns category image when type is "category"', () => {
            expect(getFallbackImageUrl('category')).toBe('/assets/default-category.png');
        });

        test('returns default food image for any other type', () => {
            expect(getFallbackImageUrl('unknown')).toBe('/assets/default-food.png');
            expect(getFallbackImageUrl('recipe')).toBe('/assets/default-food.png');
        });
    });
});