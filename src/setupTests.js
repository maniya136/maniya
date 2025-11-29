// Setup file for Jest tests
import '@testing-library/jest-dom';

// Mock process.env for tests
if (typeof process === 'undefined') {
  global.process = {
    env: {
      NODE_ENV: 'test',
      REACT_APP_API_URL: '/api/Users/register',
    },
  };
}
