import { createLogger, apiLogger, firebaseLogger, authLogger, appLogger, dbLogger, default as logger } from './logger';
import * as Sentry from '@sentry/react';
import { LOG_CONFIG } from '../config';

vi.mock('@sentry/react');
vi.mock('../config', () => ({
  LOG_CONFIG: {
    enabled: true,
    level: 'debug',
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    contextIcons: {
      default: '⚪',
      api: '🌐',
      firebase: '🔥',
      auth: '🔑',
      app: '📱',
      database: '🗄️',
    },
    componentConfig: {
      api: {
        showSuccess: false,
        showRetryAttempts: false,
        showPayloads: false,
      },
    },
    sensitiveKeys: ['password', 'secret'],
  },
}));

describe('logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createLogger', () => {
    it('should create a logger instance with default context', () => {
      const loggerInstance = createLogger();
      expect(loggerInstance).toBeDefined();
    });

    it('should create a logger instance with custom context', () => {
      const loggerInstance = createLogger('test');
      expect(loggerInstance).toBeDefined();
    });
  });

  describe('log levels - config checks', () => {
    it('debug should not log if logging is disabled', () => {
      vi.mock('../config', () => ({
        LOG_CONFIG: { ...LOG_CONFIG, enabled: false },
      }));
      const loggerInstance = createLogger();
      const consoleLogSpy = vi.spyOn(console, 'log');
      loggerInstance.debug('test debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('debug should not log if level is higher than debug', () => {
      vi.mock('../config', () => ({
        LOG_CONFIG: { ...LOG_CONFIG, level: 'info' },
      }));
      const loggerInstance = createLogger();
      const consoleLogSpy = vi.spyOn(console, 'log');
      loggerInstance.debug('test debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('log levels - output', () => {
    it('debug should log debug messages to console.log with correct format', () => {
      const loggerInstance = createLogger('testContext');
      const consoleLogSpy = vi.spyOn(console, 'log');
      const timestampRegex = /^\d{2}:\d{2}:\d{2} /; // e.g., "12:34:56 "

      loggerInstance.debug('test debug message');

      expect(consoleLogSpy).toHaveBeenCalled();
      const logOutput = consoleLogSpy.mock.calls[0][0];
      expect(logOutput).toMatch(timestampRegex);
      expect(logOutput).toContain('⚪'); // Default icon
      expect(logOutput).toContain('TESTCONTEXT');
      expect(logOutput).toContain('⚙️'); // Debug icon
      expect(logOutput).toContain('test debug message');
    });

    it('info should log info messages to console.info with correct format', () => {
      const loggerInstance = createLogger('testContext');
      const consoleInfoSpy = vi.spyOn(console, 'info');
      const timestampRegex = /^\d{2}:\d{2}:\d{2} /;

      loggerInstance.info('test info message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const logOutput = consoleInfoSpy.mock.calls[0][0];
      expect(logOutput).toMatch(timestampRegex);
      expect(logOutput).toContain('⚪'); // Default icon
      expect(logOutput).toContain('TESTCONTEXT');
      expect(logOutput).toContain('ℹ️'); // Info icon
      expect(logOutput).toContain('test info message');
    });

    it('warn should log warn messages to console.warn with correct format', () => {
      const loggerInstance = createLogger('testContext');
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      const timestampRegex = /^\d{2}:\d{2}:\d{2} /;

      loggerInstance.warn('test warn message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const logOutput = consoleWarnSpy.mock.calls[0][0];
      expect(logOutput).toMatch(timestampRegex);
      expect(logOutput).toContain('⚪'); // Default icon
      expect(logOutput).toContain('TESTCONTEXT');
      expect(logOutput).toContain('⚠️'); // Warn icon
      expect(logOutput).toContain('test warn message');
    });

    it('error should log error messages to console.error with correct format', () => {
      const loggerInstance = createLogger('testContext');
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const timestampRegex = /^\d{2}:\d{2}:\d{2} /;

      loggerInstance.error('test error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const logOutput = consoleErrorSpy.mock.calls[0][0];
      expect(logOutput).toMatch(timestampRegex);
      expect(logOutput).toContain('⚪'); // Default icon
      expect(logOutput).toContain('TESTCONTEXT');
      expect(logOutput).toContain('❌'); // Error icon
      expect(logOutput).toContain('test error message');
    });

    it('success should log success messages to console.info with correct format', () => {
      const loggerInstance = createLogger('testContext');
      const consoleInfoSpy = vi.spyOn(console, 'info');
      const timestampRegex = /^\d{2}:\d{2}:\d{2} /;

      loggerInstance.success('test success message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const logOutput = consoleInfoSpy.mock.calls[0][0];
      expect(logOutput).toMatch(timestampRegex);
      expect(logOutput).toContain('⚪'); // Default icon
      expect(logOutput).toContain('TESTCONTEXT');
      expect(logOutput).toContain('✅'); // Success icon
      expect(logOutput).toContain('test success message');
    });

    it('debug should log data argument if provided', () => {
      const loggerInstance = createLogger();
      const consoleLogSpy = vi.spyOn(console, 'log');
      const mockData = { key: 'value' };
      loggerInstance.debug('test debug message', mockData);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('test debug message'), mockData);
    });

    it('info should log data argument if provided', () => {
      const loggerInstance = createLogger();
      const consoleInfoSpy = vi.spyOn(console, 'info');
      const mockData = { key: 'value' };
      loggerInstance.info('test info message', mockData);
      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('test info message'), mockData);
    });

    it('warn should log data argument if provided', () => {
      const loggerInstance = createLogger();
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      const mockData = { key: 'value' };
      loggerInstance.warn('test warn message', mockData);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('test warn message'), mockData);
    });

    it('error should log data argument if provided', () => {
      const loggerInstance = createLogger();
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const mockData = { key: 'value' };
      loggerInstance.error('test error message', mockData);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('test error message'), mockData);
      expect(Sentry.captureException).toHaveBeenCalledWith('test error message', { extra: mockData });
    });

    it('success should log data argument if provided', () => {
      const loggerInstance = createLogger();
      const consoleInfoSpy = vi.spyOn(console, 'info');
      const mockData = { key: 'value' };
      loggerInstance.success('test success message', mockData);
      expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('test success message'), mockData);
    });
  });

  describe('helper methods', () => {
    it('shouldLogRetry should return true by default', () => {
      const loggerInstance = createLogger();
      expect(loggerInstance.shouldLogRetry()).toBe(true);
    });

    it('shouldLogRetry should return false for api logger if showRetryAttempts is false', () => {
      const loggerInstance = createLogger('api');
      expect(loggerInstance.shouldLogRetry()).toBe(false);
    });

    it('shouldLogPayloads should return true by default', () => {
      const loggerInstance = createLogger();
      expect(loggerInstance.shouldLogPayloads()).toBe(true);
    });

    it('shouldLogPayloads should return false for api logger if showPayloads is false', () => {
      const loggerInstance = createLogger('api');
      expect(loggerInstance.shouldLogPayloads()).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('should sanitize sensitive keys in data object', () => {
      const loggerInstance = createLogger();
      const data = { password: 'testpassword', secretKey: 'testsecret', other: 'value' };
      const sanitizedData = loggerInstance.sanitize(data);
      expect(sanitizedData.password).toBe('tes***');
      expect(sanitizedData.secretKey).toBe('tes***');
      expect(sanitizedData.other).toBe('value');
    });

    it('should handle non-object data', () => {
      const loggerInstance = createLogger();
      expect(loggerInstance.sanitize('test string')).toBe('test string');
      expect(loggerInstance.sanitize(123)).toBe(123);
      expect(loggerInstance.sanitize(null)).toBe(null);
      expect(loggerInstance.sanitize(undefined)).toBe(undefined);
    });

    it('should sanitize nested objects', () => {
      const loggerInstance = createLogger();
      const data = {
        nested: { password: 'nestedpassword' },
        other: 'value'
      };
      const sanitizedData = loggerInstance.sanitize(data);
      expect(sanitizedData.nested.password).toBe('nes***');
      expect(sanitizedData.other).toBe('value');
    });
  });

  describe('pre-configured loggers', () => {
    it('apiLogger should be defined', () => {
      expect(apiLogger).toBeDefined();
    });

    it('firebaseLogger should be defined', () => {
      expect(firebaseLogger).toBeDefined();
    });

    it('authLogger should be defined', () => {
      expect(authLogger).toBeDefined();
    });

    it('appLogger should be defined', () => {
      expect(appLogger).toBeDefined();
    });

    it('dbLogger should be defined', () => {
      expect(dbLogger).toBeDefined();
    });

    it('default logger should be defined', () => {
      expect(logger).toBeDefined();
    });
  });
});
