import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import {
auth, 
signIn, 
signUp, 
signOutUser, 
handleGoogleSignIn,
createUserWithEmailAndPassword, 
signInWithEmailAndPassword, 
signInWithPopup, 
signOut 
} from './firebase';

// Mock Firebase auth
vi.mock('firebase/auth', () => {
return {
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn(),
    GoogleAuthProvider: vi.fn(() => ({})),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn()
};
});

// Mock react-toastify
vi.mock('react-toastify', () => {
return {
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
};
});

import {
createUserWithEmailAndPassword, 
signInWithEmailAndPassword, 
signInWithPopup, 
signOut 
} from 'firebase/auth';

describe('Firebase Auth Utilities', () => {
const mockNavigate = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
});

describe('signUp', () => {
    it('should call createUserWithEmailAndPassword with correct parameters', () => {
        // Act
        signUp('test@example.com', 'password123', mockNavigate);
        
        // Assert
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth, 'test@example.com', 'password123'
        );
    });

    it('should show success toast and navigate to profile on success', async () => {
        // Arrange
        const mockUser = { uid: '123' };
        createUserWithEmailAndPassword.mockResolvedValueOnce({ 
            user: mockUser 
        });
        
        // Act
        signUp('test@example.com', 'password123', mockNavigate);
        
        // Wait for promises
        await vi.runAllTimersAsync();
        
        // Assert
        expect(toast.success).toHaveBeenCalledWith('Sign Up Successful!');
        expect(setTimeout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should handle errors properly', async () => {
        // Arrange
        const mockError = new Error('Auth error');
        mockError.code = 'auth/email-already-in-use';
        createUserWithEmailAndPassword.mockRejectedValueOnce(mockError);
        
        // Act
        signUp('test@example.com', 'password123', mockNavigate);
        
        // Wait for promises
        await vi.runAllTimersAsync();
        
        // Assert
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});

describe('signIn', () => {
    it('should call signInWithEmailAndPassword with correct parameters', () => {
        // Act
        signIn('test@example.com', 'password123', mockNavigate);
        
        // Assert
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            auth, 'test@example.com', 'password123'
        );
    });

    it('should show success toast and navigate to profile on success', async () => {
        // Arrange
        const mockUser = { uid: '123' };
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
        
        // Act
        signIn('test@example.com', 'password123', mockNavigate);
        
        // Wait for promises
        await vi.runAllTimersAsync();
        
        // Assert
        expect(toast.success).toHaveBeenCalledWith('Sign In Successful!');
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
});

describe('handleGoogleSignIn', () => {
    it('should call signInWithPopup with auth and provider', async () => {
        // Arrange
        signInWithPopup.mockResolvedValueOnce({ user: { uid: '123' } });
        
        // Act
        await handleGoogleSignIn(mockNavigate);
        
        // Assert
        expect(signInWithPopup).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Login Successful!');
    });
});

describe('signOutUser', () => {
    it('should call signOut with auth', () => {
        // Act
        signOutUser();
        
        // Assert
        expect(signOut).toHaveBeenCalledWith(auth);
    });

    it('should show success toast on successful sign out', async () => {
        // Arrange
        signOut.mockResolvedValueOnce();
        
        // Act
        signOutUser();
        
        // Wait for promises
        await vi.runAllTimersAsync();
        
        // Assert
        expect(toast.success).toHaveBeenCalledWith('Sign Out Successful!');
    });
});
});