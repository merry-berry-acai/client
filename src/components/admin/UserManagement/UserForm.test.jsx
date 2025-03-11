import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from './UserForm';

const mockOnClose = vi.fn();
const mockOnSave = vi.fn();

describe('<UserForm />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders UserForm component in add mode', () => {
    render(<UserForm open onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByRole('dialog', { name: /add new user/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('renders UserForm component in edit mode', () => {
    const mockUser = { displayName: 'Test User', email: 'test@example.com', role: 'user', isActive: true };
    render(<UserForm open onClose={mockOnClose} onSave={mockOnSave} user={mockUser} />);
    expect(screen.getByRole('dialog', { name: /edit user/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/change password \(leave empty to keep current\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('calls onSave with form data when submitted in add mode', async () => {
    render(<UserForm open onClose={mockOnClose} onSave={mockOnSave} />);
    userEvent.type(screen.getByLabelText(/full name/i), 'New User');
    userEvent.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        displayName: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        isActive: true,
      });
    });
  });

  it('calls onSave with form data when submitted in edit mode', async () => {
    const mockUser = { _id: '123', displayName: 'Test User', email: 'test@example.com', role: 'user', isActive: true };
    render(<UserForm open onClose={mockOnClose} onSave={mockOnSave} user={mockUser} />);
    userEvent.type(screen.getByLabelText(/full name/i), 'Updated User');
    userEvent.click(screen.getByRole('button', { name: /update/i }));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        displayName: 'Updated User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
      });
    });
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<UserForm open onClose={mockOnClose} onSave={mockOnSave} />);
    const dialog = screen.getByRole('dialog', { name: /add new user/i }); // Assuming add mode for cancel button test
    userEvent.click(dialog.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});