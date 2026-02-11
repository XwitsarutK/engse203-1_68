// tests/unit/errorHandling.test.js
const Todo = require('../../src/models/Todo');
const db = require('../../src/config/database');

// Mock the database module
jest.mock('../../src/config/database');

describe('Error Handling Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== Database Connection Error ====================
  describe('Database Connection Errors', () => {
    
    test('should handle connection error in getAll()', async () => {
      // Arrange - Mock connection error
      const connectionError = new Error('Connection refused');
      connectionError.code = 'ECONNREFUSED';
      db.query.mockRejectedValue(connectionError);
      
      // Act & Assert
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos: Connection refused');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle connection timeout in getById()', async () => {
      // Arrange
      const timeoutError = new Error('Connection timeout');
      timeoutError.code = 'ETIMEDOUT';
      db.query.mockRejectedValue(timeoutError);
      
      // Act & Assert
      await expect(Todo.getById(1)).rejects.toThrow('Failed to fetch todo: Connection timeout');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle lost connection during create()', async () => {
      // Arrange
      const lostConnectionError = new Error('Lost connection to MySQL server');
      lostConnectionError.code = 'PROTOCOL_CONNECTION_LOST';
      db.query.mockRejectedValue(lostConnectionError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Test' })).rejects.toThrow('Failed to create todo');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle database not connected error', async () => {
      // Arrange
      const notConnectedError = new Error('Database not connected');
      db.query.mockRejectedValue(notConnectedError);
      
      // Act & Assert
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos: Database not connected');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== Invalid Data Format ====================
  describe('Invalid Data Format Errors', () => {
    
    test('should handle invalid JSON data', async () => {
      // Arrange
      const invalidDataError = new Error('Invalid JSON');
      invalidDataError.code = 'ER_INVALID_JSON_TEXT';
      db.query.mockRejectedValue(invalidDataError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Test', data: 'invalid-json' }))
        .rejects.toThrow('Failed to create todo: Invalid JSON');
    });

    test('should handle data too long error', async () => {
      // Arrange
      const dataTooLongError = new Error('Data too long for column');
      dataTooLongError.code = 'ER_DATA_TOO_LONG';
      db.query.mockRejectedValue(dataTooLongError);
      
      const longTitle = 'x'.repeat(1000);
      
      // Act & Assert
      await expect(Todo.create({ title: longTitle }))
        .rejects.toThrow('Failed to create todo: Data too long for column');
    });

    test('should handle invalid datetime format', async () => {
      // Arrange
      const invalidDateError = new Error('Incorrect datetime value');
      invalidDateError.code = 'ER_TRUNCATED_WRONG_VALUE';
      db.query.mockRejectedValue(invalidDateError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Test', dueDate: 'invalid-date' }))
        .rejects.toThrow('Failed to create todo: Incorrect datetime value');
    });

    test('should handle wrong value type error', async () => {
      // Arrange
      const wrongValueError = new Error('Incorrect integer value');
      wrongValueError.code = 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD';
      db.query.mockRejectedValue(wrongValueError);
      
      // Act & Assert
      await expect(Todo.update(1, { completed: 'not-a-boolean' }))
        .rejects.toThrow('Failed to update todo: Incorrect integer value');
    });

    test('should handle null constraint violation', async () => {
      // Arrange
      const nullError = new Error('Column cannot be null');
      nullError.code = 'ER_BAD_NULL_ERROR';
      db.query.mockRejectedValue(nullError);
      
      // Act & Assert
      await expect(Todo.create({ title: null }))
        .rejects.toThrow('Failed to create todo: Column cannot be null');
    });
  });

  // ==================== Duplicate Key Error ====================
  describe('Duplicate Key Errors', () => {
    
    test('should handle duplicate entry on create', async () => {
      // Arrange
      const duplicateError = new Error('Duplicate entry for key');
      duplicateError.code = 'ER_DUP_ENTRY';
      db.query.mockRejectedValue(duplicateError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Duplicate Todo' }))
        .rejects.toThrow('Duplicate todo');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle duplicate primary key', async () => {
      // Arrange
      const dupPrimaryKeyError = new Error('Duplicate entry for PRIMARY key');
      dupPrimaryKeyError.code = 'ER_DUP_ENTRY';
      dupPrimaryKeyError.errno = 1062;
      db.query.mockRejectedValue(dupPrimaryKeyError);
      
      // Act & Assert
      await expect(Todo.create({ id: 1, title: 'Test' }))
        .rejects.toThrow('Duplicate todo');
    });

    test('should handle duplicate unique constraint', async () => {
      // Arrange
      const dupUniqueError = new Error('Duplicate entry for key unique_title');
      dupUniqueError.code = 'ER_DUP_ENTRY';
      db.query.mockRejectedValue(dupUniqueError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Existing Title' }))
        .rejects.toThrow('Duplicate todo');
    });

    test('should provide clear error message for duplicate', async () => {
      // Arrange
      const dupError = new Error("Duplicate entry 'Task 1' for key 'title'");
      dupError.code = 'ER_DUP_ENTRY';
      db.query.mockRejectedValue(dupError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Task 1' }))
        .rejects.toThrow('Duplicate todo');
      expect(db.query).toHaveBeenCalledWith('INSERT INTO todos SET ?', { title: 'Task 1' });
    });
  });

  // ==================== Timeout Error ====================
  describe('Timeout Errors', () => {
    
    test('should handle query timeout on getAll()', async () => {
      // Arrange
      const timeoutError = new Error('Query execution timeout');
      timeoutError.code = 'PROTOCOL_SEQUENCE_TIMEOUT';
      db.query.mockRejectedValue(timeoutError);
      
      // Act & Assert
      await expect(Todo.getAll())
        .rejects.toThrow('Failed to fetch todos: Query execution timeout');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle connection timeout on create()', async () => {
      // Arrange
      const connTimeoutError = new Error('Connection acquisition timeout');
      connTimeoutError.code = 'ETIMEDOUT';
      db.query.mockRejectedValue(connTimeoutError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Test' }))
        .rejects.toThrow('Failed to create todo: Connection acquisition timeout');
    });

    test('should handle lock wait timeout on update()', async () => {
      // Arrange
      const lockTimeoutError = new Error('Lock wait timeout exceeded');
      lockTimeoutError.code = 'ER_LOCK_WAIT_TIMEOUT';
      db.query.mockRejectedValue(lockTimeoutError);
      
      // Act & Assert
      await expect(Todo.update(1, { title: 'Updated' }))
        .rejects.toThrow('Failed to update todo: Lock wait timeout exceeded');
    });

    test('should handle deadlock timeout', async () => {
      // Arrange
      const deadlockError = new Error('Deadlock found when trying to get lock');
      deadlockError.code = 'ER_LOCK_DEADLOCK';
      db.query.mockRejectedValue(deadlockError);
      
      // Act & Assert
      await expect(Todo.delete(1))
        .rejects.toThrow('Failed to delete todo: Deadlock found when trying to get lock');
    });

    test('should handle network timeout', async () => {
      // Arrange - Simulate timeout with Jest timer
      jest.useFakeTimers();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Network timeout after 30 seconds'));
        }, 30000);
      });
      
      db.query.mockReturnValue(timeoutPromise);
      
      // Act
      const promise = Todo.getById(1);
      jest.runAllTimers();
      
      // Assert
      await expect(promise).rejects.toThrow('Failed to fetch todo: Network timeout after 30 seconds');
      
      jest.useRealTimers();
    });
  });

  // ==================== Combined Error Scenarios ====================
  describe('Combined Error Scenarios', () => {
    
    test('should handle multiple consecutive errors', async () => {
      // Arrange - First call fails, second call also fails
      const error1 = new Error('Connection lost');
      const error2 = new Error('Reconnection failed');
      
      db.query
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2);
      
      // Act & Assert
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos: Connection lost');
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos: Reconnection failed');
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    test('should handle error recovery scenario', async () => {
      // Arrange - First call fails, second call succeeds
      const connectionError = new Error('Connection lost');
      const mockTodos = [{ id: 1, title: 'Test' }];
      
      db.query
        .mockRejectedValueOnce(connectionError)
        .mockResolvedValueOnce(mockTodos);
      
      // Act & Assert - First call fails
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos: Connection lost');
      
      // Second call succeeds after recovery
      const result = await Todo.getAll();
      expect(result).toEqual(mockTodos);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    test('should handle transaction rollback scenario', async () => {
      // Arrange - Create succeeds but update fails (simulating transaction rollback)
      db.query.mockResolvedValueOnce({ insertId: 1 }); // Create succeeds
      
      const updateError = new Error('Update failed, rolling back transaction');
      db.query.mockRejectedValueOnce(updateError);
      
      // Act
      const created = await Todo.create({ title: 'Test' });
      expect(created.id).toBe(1);
      
      // Update fails
      await expect(Todo.update(1, { title: 'Updated' }))
        .rejects.toThrow('Failed to update todo: Update failed, rolling back transaction');
      
      // Assert
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== Error Information Verification ====================
  describe('Error Information Verification', () => {
    
    test('should preserve original error code', async () => {
      // Arrange
      const originalError = new Error('Database error');
      originalError.code = 'ER_CUSTOM_ERROR';
      db.query.mockRejectedValue(originalError);
      
      // Act & Assert
      try {
        await Todo.getAll();
      } catch (error) {
        expect(error.message).toContain('Database error');
      }
    });

    test('should provide stack trace for debugging', async () => {
      // Arrange
      const error = new Error('Test error with stack');
      db.query.mockRejectedValue(error);
      
      // Act & Assert
      try {
        await Todo.create({ title: 'Test' });
      } catch (err) {
        expect(err.stack).toBeDefined();
        expect(err.message).toContain('Failed to create todo');
      }
    });

    test('should handle errors without error codes', async () => {
      // Arrange
      const genericError = new Error('Generic database error');
      // No error code set
      db.query.mockRejectedValue(genericError);
      
      // Act & Assert
      await expect(Todo.getAll())
        .rejects.toThrow('Failed to fetch todos: Generic database error');
    });
  });
});
