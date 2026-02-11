// tests/__mocks__/database.js
// Mock database module for testing

const db = {
  connection: { connected: true },
  
  // Mock query function
  query: jest.fn(),
  
  // Mock connect function
  connect: jest.fn().mockResolvedValue(undefined),
  
  // Mock close function
  close: jest.fn().mockResolvedValue(undefined)
};

module.exports = db;
