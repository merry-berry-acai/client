import * as notificationModule from './notifications';

describe('firebase/notifications', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleInfo = console.info;

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.info = originalConsoleInfo;
    jest.clearAllMocks();
  });

  it('should use console.log for default success snackbar', () => {
    notificationModule.showSnackbar.success('Success message');
    expect(console.log).toHaveBeenCalledWith('Toast success:', 'Success message');
  });

  it('should use console.error for default error snackbar', () => {
    notificationModule.showSnackbar.error('Error message');
    expect(console.error).toHaveBeenCalledWith('Toast error:', 'Error message');
  });

  it('should use console.info for default info snackbar', () => {
    notificationModule.showSnackbar.info('Info message');
    expect(console.info).toHaveBeenCalledWith('Toast info:', 'Info message');
  });

  it('should update showSnackbar functions using setSnackbarFunctions', () => {
    const mockSnackbarFns = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };
    notificationModule.setSnackbarFunctions(mockSnackbarFns);
    notificationModule.showSnackbar.success('Updated success message');
    expect(mockSnackbarFns.success).toHaveBeenCalledWith('Updated success message');
  });
});
