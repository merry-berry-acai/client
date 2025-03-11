import { describe, test, expect, vi } from 'vitest';
import { logMissingImages } from './debugMenu';

describe('logMissingImages', () => {
    test('should return empty array for null or undefined menuItems', () => {
        expect(logMissingImages(null)).toEqual([]);
        expect(logMissingImages(undefined)).toEqual([]);
    });

    test('should return empty array for empty menuItems array', () => {
        expect(logMissingImages([])).toEqual([]);
    });

    test('should return empty array if not in development mode', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        const originalMetaEnvDev = import.meta.env.DEV;

        process.env.NODE_ENV = 'production';
        import.meta.env.DEV = false;
        expect(logMissingImages([{ name: 'Item 1' }])).toEqual([]);

        process.env.NODE_ENV = originalNodeEnv;
        import.meta.env.DEV = originalMetaEnvDev;
    });

    test('should return items with missing images in development mode', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        const originalMetaEnvDev = import.meta.env.DEV;

        process.env.NODE_ENV = 'development';
        import.meta.env.DEV = true;
        const menuItems = [
            { name: 'Item 1', imageURL: 'url' },
            { name: 'Item 2', image: 'image' },
            { name: 'Item 3', imagePath: 'path' },
            { name: 'Item 4', imageUrl: 'url' },
            { name: 'Item 5' }, // Missing image
            { name: 'Item 6' }  // Missing image
        ];
        const expectedMissingImages = [
            { name: 'Item 5' },
            { name: 'Item 6' }
        ];
        expect(logMissingImages(menuItems)).toEqual(expectedMissingImages);

        process.env.NODE_ENV = originalNodeEnv;
        import.meta.env.DEV = originalMetaEnvDev;
    });

    test('should return empty array if no items are missing images in development mode', () => {
        const originalNodeEnv = process.env.NODE_ENV;
        const originalMetaEnvDev = import.meta.env.DEV;

        process.env.NODE_ENV = 'development';
        import.meta.env.DEV = true;
        const menuItems = [
            { name: 'Item 1', imageURL: 'url' },
            { name: 'Item 2', image: 'image' },
            { name: 'Item 3', imagePath: 'path' },
            { name: 'Item 4', imageUrl: 'url' },
        ];
        expect(logMissingImages(menuItems)).toEqual([]);

        process.env.NODE_ENV = originalNodeEnv;
        import.meta.env.DEV = originalMetaEnvDev;
    });
});
