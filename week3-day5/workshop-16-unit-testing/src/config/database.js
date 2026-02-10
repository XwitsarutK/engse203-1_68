// src/config/database.js
class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    // Simulate database connection
    this.connection = { connected: true };
  }

  async query(sql, params = []) {
    // This will be mocked in tests
    if (!this.connection) {
      throw new Error('Database not connected');
    }
    // Actual implementation would execute SQL query
    throw new Error('Database query must be mocked in tests');
  }

  async close() {
    this.connection = null;
  }
}

module.exports = new Database();
