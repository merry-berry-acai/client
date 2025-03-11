import * as firebaseAuth from '../firebase/auth';
import * as utilsFirebase from './firebase';

vi.mock('../firebase/auth', () => ({
  auth: { mockAuth: true },
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOutUser: vi.fn(),
  handleGoogleSignIn: vi.fn(),
  getCurrentUserToken: vi.fn(),
  setupAuthStateListener: vi.fn()
}));

describe('utils/firebase', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should re-export auth from firebase/auth', () => {
    expect(utilsFirebase.auth).toEqual({ mockAuth: true });
  });

  it('should re-export signIn from firebase/auth', () => {
    utilsFirebase.signIn();
    expect(firebaseAuth.signIn).toHaveBeenCalled();
  });

  it('should re-export signUp from firebase/auth', () => {
    utilsFirebase.signUp();
    expect(firebaseAuth.signUp).toHaveBeenCalled();
  });

  it('should re-export signOutUser from firebase/auth', () => {
    utilsFirebase.signOutUser();
    expect(firebaseAuth.signOutUser).toHaveBeenCalled();
  });

  it('should re-export handleGoogleSignIn from firebase/auth', () => {
    utilsFirebase.handleGoogleSignIn();
    expect(firebaseAuth.handleGoogleSignIn).toHaveBeenCalled();
  });

  it('should re-export getCurrentUserToken from firebase/auth', () => {
    utilsFirebase.getCurrentUserToken();
    expect(firebaseAuth.getCurrentUserToken).toHaveBeenCalled();
  });

  it('should call setupAuthStateListener on module load', () => {
    expect(firebaseAuth.setupAuthStateListener).toHaveBeenCalled();
  });
});
