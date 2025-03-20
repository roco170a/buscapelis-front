import '@testing-library/jest-dom';

// RCC: Global setup for tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
}; 