import React from 'react';
import { renderHook, act, render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider, useSnackbar, SnackbarContext } from './SnackbarContext';

const renderSnackbarHook = () => renderHook(() => useSnackbar(), { wrapper: SnackbarProvider });

const TestConsumer = () => {
  const { showSuccess, showError, showInfo, showWarning } = useSnackbar();
  return (
    <>
      <button onClick={() => showSuccess('Success message')} id="success-button">Show Success</button>
      <button onClick={() => showError('Error message')} id="error-button">Show Error</button>
      <button onClick={() => showInfo('Info message')} id="info-button">Show Info</button>
      <button onClick={() => showWarning('Warning message')} id="warning-button">Show Warning</button>
    </>
  );
};

describe('SnackbarContext', () => {
  it('should provide snackbar functions', () => {
    const { result } = renderSnackbarHook();
    expect(result.current.showSuccess).toBeInstanceOf(Function);
    expect(result.current.showError).toBeInstanceOf(Function);
    expect(result.current.showInfo).toBeInstanceOf(Function);
    expect(result.current.showWarning).toBeInstanceOf(Function);
  });
});

describe('SnackbarProvider', () => {
  it('should render Snackbar component', () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument(); // Assert Snackbar is rendered (MUI Alert has role alert)
  });

  it('should show success snackbar when showSuccess is called', async () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    );
    act(() => {
      screen.getByRole('button', { name: /show success/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeVisible();
    });
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-severitySuccess');
  });

  it('should show error snackbar when showError is called', async () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    );
    act(() => {
      screen.getByRole('button', { name: /show error/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeVisible();
    });
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-severityError');
  });

  it('should show info snackbar when showInfo is called', async () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    );
    act(() => {
      screen.getByRole('button', { name: /show info/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeVisible();
    });
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-severityInfo');
  });

  it('should show warning snackbar when showWarning is called', async () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    );
    act(() => {
      screen.getByRole('button', { name: /show warning/i }).click();
    });
    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeVisible();
    });
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-severityWarning');
  });
});
