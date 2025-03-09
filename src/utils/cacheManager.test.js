import { describe, test, expect, vi } from 'vitest';
import { 
    getCacheKey,
    invalidateCache,
} from './cacheManager';
import * as config from '../config'; // Import entire config module

describe('cacheManager', () => {
    test('getCacheKey should return cache key with prefix', () => {
        const CACHE_CONFIG_mock = { 
            storagePrefix: 'test_',
            keys: { 
                menuItems: 'menu_items',
                categories: 'categories' 
            }
        };
        vi.spyOn(config, 'CACHE_CONFIG', 'get').mockReturnValue(CACHE_CONFIG_mock);
        console.log('CACHE_CONFIG.storagePrefix:', config.CACHE_CONFIG.storagePrefix);
        expect(getCacheKey('testKey')).toBe('test_testKey');
    });

    describe('invalidateCache', () => {
        test('should invalidate cache for valid cache types', () => {
            const removeItemMock = vi.spyOn(localStorage, 'removeItem');
            invalidateCache(['menuItems', 'categories']);
            expect(removeItemMock).toHaveBeenCalledTimes(2);
            expect(removeItemMock).toHaveBeenCalledWith('test_menu_items');
            expect(removeItemMock).toHaveBeenCalledWith('test_categories');
        });

        test('should warn and return if no cache types are provided', () => {
            const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
            invalidateCache([]);
            expect(warnMock).toHaveBeenCalledWith('No cache types specified for invalidation');
            warnMock.mockRestore();
        });

        test('should warn and return for unknown cache type', () => {
            const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
            invalidateCache(['unknownCacheType']);
            expect(warnMock).toHaveBeenCalledWith('Unknown cache type: unknownCacheType');
            warnMock.mockRestore();
        });

        test('should handle null and undefined cacheTypes gracefully', () => {
            const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
            invalidateCache(null);
            expect(warnMock).toHaveBeenCalledWith('No cache types specified for invalidation');
            invalidateCache(undefined);
            expect(warnMock).toHaveBeenCalledWith('No cache types specified for invalidation');
            warnMock.mockRestore();
        });
    });
});
