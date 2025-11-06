import '@testing-library/jest-dom';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

mockIntersectionObserver();

// Here is mock ResizeObserver for JSDOM
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});