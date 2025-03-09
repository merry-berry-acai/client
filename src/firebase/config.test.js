import { initializeApp, getAuth, GoogleAuthProvider } from 'firebase/app';
import { FIREBASE_CONFIG } from '../config';
import * as firebaseConfigModule from './config';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ firebase: 'app' })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ firebase: 'auth' })),
  GoogleAuthProvider: jest.fn(() => ({ google: 'provider' })),
}));

describe('firebase/config', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize firebase app with FIREBASE_CONFIG', () => {
    expect(initializeApp).toHaveBeenCalledWith(FIREBASE_CONFIG);
  });

  it('should initialize auth', () => {
    expect(getAuth).toHaveBeenCalledWith({ firebase: 'app' });
  });

  it('should initialize googleAuthProvider', () => {
    expect(GoogleAuthProvider).toHaveBeenCalled();
  });

  it('should export app, auth, and googleProvider', () => {
    expect(firebaseConfigModule.app).toEqual({ firebase: 'app' });
    expect(firebaseConfigModule.auth).toEqual({ firebase: 'auth' });
    expect(firebaseConfigModule.googleProvider).toEqual({ google: 'provider' });
  });
});
