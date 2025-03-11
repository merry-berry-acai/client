import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from './AdminPanel';

// Mock necessary modules and components
jest.mock('./CategoryManager', () => () => <div>CategoryManager Mock</div>);

// Test suite for AdminPanel
describe('AdminPanel', () => {
  test('renders without crashing', () => {
    render(<AdminPanel />);
    expect(screen.getByText('CategoryManager Mock')).toBeInTheDocument();
  });

  test('renders Products Content when activeTab is 2', () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByText('Products Content')).toBeInTheDocument();
  });

  test('renders Settings Content when activeTab is 3', () => {
    render(<AdminPanel />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Settings Content')).toBeInTheDocument();
  });
});
