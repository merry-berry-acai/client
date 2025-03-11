import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDetail from './UserDetail';
import * as userService from '../../../api/services/userService';
import { ApiDebugProvider } from '../common/ApiDebugProvider';

vi.mock('../../../api/services/userService');

 const mockUser = {
  _id: '123',
  displayName: 'Test User',
  email: 'test@example.com',
  role: 'user',
  isActive: true,
  createdAt: '2023-01-01T12:00:00.000Z',
  updatedAt: '2023-01-02T12:00:00.000Z',
};

const mockOnClose = vi.fn();

describe('<UserDetail />', () => {
  beforeEach(() => {
    userService.fetchUserById.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders UserDetail component and fetches user data', async () => {
    render(
      <ApiDebugProvider>
        <UserDetail open onClose={mockOnClose} userId="123" />
      </ApiDebugProvider>
    );

    await waitFor(() => {
      expect(userService.fetchUserById).toHaveBeenCalledWith('123');
    });

    expect(screen.getByRole('dialog', { name: /user details/i })).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText(/created at/i)).toBeInTheDocument();
    expect(screen.getByText(/updated at/i)).toBeInTheDocument();
  });

  it('displays loading state initially and then user data', async () => {
    render(
      <ApiDebugProvider>
        <UserDetail open onClose={mockOnClose} userId="123" />
      </ApiDebugProvider>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('displays error message if fetchUserById fails', async () => {
    userService.fetchUserById.mockRejectedValue(new Error('Failed to fetch user'));
    render(
      <ApiDebugProvider>
        <UserDetail open onClose={mockOnClose} userId="123" />
      </ApiDebugProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert', { severity: 'error' })).toBeInTheDocument();
      expect(screen.getByText(/failed to load user details/i)).toBeInTheDocument();
    });
  });

  it('closes dialog when Close button is clicked', () => {
    render(
      <ApiDebugProvider>
        <UserDetail open onClose={mockOnClose} userId="123" />
      </ApiDebugProvider>
    );
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});