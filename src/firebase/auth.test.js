import * as firebaseAuth from 'firebase/auth';
import * as authModule from './auth';
import * as notificationModule from './notifications';
import * as userService from '../api/services/userService';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('./notifications', () => ({
  showSnackbar: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  }
}));

jest.mock('../api/services/userService', () => ({
  sendUserToDB: jest.fn()
}));

const mockUser = {
  uid: 'testUid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'test.jpg',
  getIdToken: jest.fn(() => Promise.resolve('testToken'))
};

describe('firebase/auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setupAuthStateListener', () => {
    it('should call onAuthStateChanged', () => {
      authModule.setupAuthStateListener();
      expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalled();
    });
  });

  describe('handleGoogleSignIn', () => {
    it('should handle successful Google sign in', async () => {
      firebaseAuth.signInWithPopup.mockResolvedValue({ user: mockUser });
      const navigate = jest.fn();
      await authModule.handleGoogleSignIn(navigate);
      expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
      expect(userService.sendUserToDB).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.success).toHaveBeenCalledWith("Login Successful!");
      expect(navigate).toHaveBeenCalledWith("/profile");
    });

    it('should handle failed Google sign in', async () => {
      firebaseAuth.signInWithPopup.mockRejectedValue(new Error('Google sign in failed'));
      const navigate = jest.fn();
      await authModule.handleGoogleSignIn(navigate);
      expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
      expect(userService.sendUserToDB).not.toHaveBeenCalled();
      expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Google Sign-In failed. Please try again.");
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should handle successful sign up', async () => {
      firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      const navigate = jest.fn();
      await authModule.signUp('test@example.com', 'password', navigate, 'Test User');
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(firebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser, { displayName: 'Test User' });
      expect(userService.sendUserToDB).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.success).toHaveBeenCalledWith("Sign Up Successful!");
      expect(navigate).toHaveBeenCalledWith("/profile");
    });

    it('should handle failed sign up', async () => {
      firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(new Error('Sign up failed'));
      const navigate = jest.fn();
      await authModule.signUp('test@example.com', 'password', navigate, 'Test User');
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(firebaseAuth.updateProfile).not.toHaveBeenCalled();
      expect(userService.sendUserToDB).not.toHaveBeenCalled();
      expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Sign-up failed. Please try again.");
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should handle email already in use error', async () => {
      const error = new Error('Email already in use');
      error.code = 'auth/email-already-in-use';
      firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(error);
      const navigate = jest.fn();
      try {
        await authModule.signUp('test@example.com', 'password', navigate, 'Test User');
      } catch (e) {
        expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Email already in use. Please use a different email or sign in.");
      }
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(firebaseAuth.updateProfile).not.toHaveBeenCalled();
      expect(userService.sendUserToDB).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should handle successful sign in', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      const navigate = jest.fn();
      await authModule.signIn('test@example.com', 'password', navigate);
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.success).toHaveBeenCalledWith("Sign In Successful!");
      expect(navigate).toHaveBeenCalledWith("/profile");
    });

    it('should handle invalid email or password error', async () => {
      const error = new Error('Invalid credentials');
      error.code = 'auth/wrong-password';
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(error);
      const navigate = jest.fn();
      try {
        await authModule.signIn('test@example.com', 'password', navigate);
      } catch (e) {
        expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Invalid email or password.");
      }
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Invalid email or password.");
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should handle general sign in error', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(new Error('Sign in failed'));
      const navigate = jest.fn();
      try {
        await authModule.signIn('test@example.com', 'password', navigate);
      } catch (e) {
        expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Sign-in failed. Please try again.");
      }
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.error).toHaveBeenCalledWith("Sign-in failed. Please try again.");
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('signOutUser', () => {
    it('should handle successful sign out', async () => {
      await authModule.signOutUser();
      expect(firebaseAuth.signOut).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.success).toHaveBeenCalledWith("Sign Out Successful!");
    });

    it('should handle failed sign out', async () => {
      firebaseAuth.signOut.mockRejectedValue(new Error('Sign out failed'));
      await authModule.signOutUser(); // Error is caught and logged, but doesn't throw
      expect(firebaseAuth.signOut).toHaveBeenCalled();
      expect(notificationModule.showSnackbar.success).toHaveBeenCalledWith("Sign Out Successful!"); // Success is still shown
    });
  });

  describe('getCurrentUserToken', () => {
    it('should return current user token if user is signed in', async () => {
      firebaseAuth.auth = { currentUser: mockUser }; // Mock auth.currentUser
      const token = await authModule.getCurrentUserToken();
      expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
      expect(token).toBe('testToken');
    });

    it('should return null if no user is signed in', async () => {
      firebaseAuth.auth = { currentUser: null }; // Mock auth.currentUser as null
      const token = await authModule.getCurrentUserToken();
      expect(mockUser.getIdToken).not.toHaveBeenCalled();
      expect(token).toBeNull();
    });

    it('should handle error getting token', async () => {
      firebaseAuth.auth = { currentUser: mockUser }; // Mock auth.currentUser
      mockUser.getIdToken.mockRejectedValue(new Error('Token error'));
      const token = await authModule.getCurrentUserToken();
      expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
      expect(token).toBeNull();
    });
  });
});
