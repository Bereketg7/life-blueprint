// jest.setup.js configuration file

// Example setup configuration for Jest

import '@testing-library/jest-dom/extend-expect';

// Global setup or configuration can go here

// You can also configure additional global variables or functions
const customGlobalFunction = () => {
    // Your custom function logic
};

global.customGlobalFunction = customGlobalFunction;
