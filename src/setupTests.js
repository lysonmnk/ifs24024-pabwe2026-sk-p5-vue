import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
window.scrollTo = vi.fn();

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
