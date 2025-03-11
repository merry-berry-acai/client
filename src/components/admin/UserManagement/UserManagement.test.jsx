import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagement from './UserManagement';
import * as userService from '../../../api/services/userService';
import { ApiDebugProvider } from '../common/ApiDebugProvider';

vi.mock('../../../api/services/userService');
 
describe('<UserManagement />', () => {
  beforeEach(() => {
    userService.fetchUsers.mockResolvedValue([]);
    userService.createUser.mockResolvedValue({});
    userService.updateUser.mockResolvedValue({});
    userService.deleteUser.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders UserManagement component', () => {
    render(
      <ApiDebugProvider>
        <UserManagement />
      </ApiDebugProvider>
    );
    expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
  });

  it('loads and displays users on mount', async () => {
    const mockUsers = [{ _id: '1', name: 'Test User' }];
    userService.fetchUsers.mockResolvedValue(mockUsers);
    render(
      <ApiDebugProvider>
        <UserManagement />
      </ApiDebugProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('opens user form when Add User button is clicked', async () => {
    render(
      <ApiDebugProvider>
        <UserManagement />
      </ApiDebugProvider>
    );
    userEvent.click(screen.getByRole('button', { name: /add user/i }));
    expect(screen.getByRole('dialog', { name: /add new user/i })).toBeInTheDocument();
  });
});