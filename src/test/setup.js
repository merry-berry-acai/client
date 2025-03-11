import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

global.window = global.window || {
  location: {
    href: "http://localhost/",
  },
};

global.document = global.document || {};

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };

window.URL.createObjectURL = window.URL.createObjectURL || vi.fn();
window.URL.revokeObjectURL = window.URL.revokeObjectURL || vi.fn();

global.IntersectionObserver =
  global.IntersectionObserver ||
  class MockIntersectionObserver {
    constructor() {
      this.observe = vi.fn();
      this.unobserve = vi.fn();
      this.disconnect = vi.fn();
    }
  };

vi.mock(
  "../firebase/config",
  () => ({
    default: {},
    auth: {
      onAuthStateChanged: vi.fn(),
      signOut: vi.fn(),
      currentUser: null,
    },
    db: {
      collection: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnThis(),
      get: vi.fn(),
      onSnapshot: vi.fn(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
    },
    googleProvider: {},
    storage: {
      ref: vi.fn().mockReturnThis(),
      child: vi.fn().mockReturnThis(),
      put: vi.fn(),
      getDownloadURL: vi.fn(),
    },
  }),
  { virtual: true }
);

vi.mock("@mui/material", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});
