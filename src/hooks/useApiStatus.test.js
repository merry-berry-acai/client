import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import useApiStatus from "../hooks/useApiStatus";
import axios from "axios";

// ✅ Mock axios to prevent real API calls
vi.mock("axios");

describe("useApiStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initially sets loading state to true", async () => {
    axios.get.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useApiStatus());

    expect(result.current.isLoading).toBe(true); // ✅ Initially true

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false); // ✅ Should be false after fetching
    });
  });

  it("sets API status to up when response is 200", async () => {
    axios.get.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useApiStatus());

    await waitFor(() => {
      expect(result.current.isUp).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  it("sets API status to down on request failure", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useApiStatus());

    await waitFor(() => {
      expect(result.current.isUp).toBe(false);
      expect(result.current.error).toBe("Network Error");
    });
  });

  it("manually refreshes API status", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useApiStatus());

    await waitFor(() => expect(result.current.isUp).toBe(true));

    axios.get.mockResolvedValueOnce({ status: 500 });

    act(() => {
      result.current.refresh(); // Manually refresh
    });

    await waitFor(() => expect(result.current.isUp).toBe(false));
  });
});
