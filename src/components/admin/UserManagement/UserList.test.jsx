import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserList from './UserList';

const mockUsers = [
  { _id: '1', displayName: 'User 1', email: 'user1@example.com', role: 'user' },
  { _id: '2', displayName: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnView = vi.fn();

describe('<UserList />', () => {
  it('renders UserList component with user data', () => {
    render(
      <UserList 
        users={mockUsers} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onView={mockOnView} 
      />
    );
    expect(screen.getByRole('cell', { name: 'User 1' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'user1@example.com' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'user' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Admin User' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'admin@example.com' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'admin' })).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    render(
      <UserList 
        users={mockUsers} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onView={mockOnView} 
      />
    );
    userEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <UserList 
        users={mockUsers} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onView={mockOnView} 
      />
    );
    userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockUsers[0]._id);
  });

  it('calls onView when View Details button is clicked', () => {
    render(
      <UserList 
        users={mockUsers} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onView={mockOnView} 
      />
    );
    userEvent.click(screen.getAllByRole('button', { name: /view details/i })[0]);
    expect(mockOnView).toHaveBeenCalledTimes(1);
    expect(mockOnView).toHaveBeenCalledWith(mockUsers[0]._id);
  });
});