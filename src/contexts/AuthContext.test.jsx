import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
      signInWithEmailAndPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChanged: vi.fn(),
    })),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));

const mockUser = {
  uid: "12345",
  email: "test@example.com",
  displayName: "Joel",
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles login", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("handles logout", async () => {
    signOut.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login("test@example.com", "password");
    });

    expect(result.current.currentUser).toEqual(mockUser);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.currentUser).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
