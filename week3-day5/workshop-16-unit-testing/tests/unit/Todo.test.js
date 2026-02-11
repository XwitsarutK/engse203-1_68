// tests/unit/Todo.test.js
const Todo = require('../../src/models/Todo');
const db = require('../../src/config/database');

// Mock the database module
jest.mock('../../src/config/database');

describe('Todo Model', () => {
  
  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== getAll() Tests ====================
  describe('getAll()', () => {
    
    test('should return all todos from database', async () => {
      // Arrange - Setup mock data
      const mockTodos = [
        { id: 1, title: 'Buy groceries', completed: false },
        { id: 2, title: 'Learn Jest', completed: true },
        { id: 3, title: 'Write tests', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act - Call the method
      const result = await Todo.getAll();
      
      // Assert - Verify results
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(3);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos ORDER BY createdAt DESC');
    });

    test('should return empty array when no todos exist', async () => {
      // Arrange
      db.query.mockResolvedValue([]);
      
      // Act
      const result = await Todo.getAll();
      
      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle database errors properly', async () => {
      // Arrange - Mock a database error
      const dbError = new Error('Database connection failed');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert - Expect error to be thrown
      await expect(Todo.getAll()).rejects.toThrow('Failed to fetch todos');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== getById() Tests ====================
  describe('getById()', () => {
    
    test('should return a single todo by ID', async () => {
      // Arrange
      const mockTodo = { id: 1, title: 'Test Todo', completed: false };
      db.query.mockResolvedValue([mockTodo]);
      
      // Act
      const result = await Todo.getById(1);
      
      // Assert
      expect(result).toEqual(mockTodo);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = ?', [1]);
    });

    test('should handle different ID types correctly', async () => {
      // Arrange
      const mockTodo = { id: 42, title: 'Task 42', completed: true };
      db.query.mockResolvedValue([mockTodo]);
      
      // Act
      const result = await Todo.getById(42);
      
      // Assert
      expect(result).toEqual(mockTodo);
      expect(result.id).toBe(42);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = ?', [42]);
    });

    test('should throw error when todo not found', async () => {
      // Arrange - Mock empty result (no todo found)
      db.query.mockResolvedValue([]);
      
      // Act & Assert
      await expect(Todo.getById(999)).rejects.toThrow('Todo not found');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle database query errors', async () => {
      // Arrange
      const dbError = new Error('Query execution failed');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert
      await expect(Todo.getById(1)).rejects.toThrow('Failed to fetch todo');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== create() Tests ====================
  describe('create()', () => {
    
    test('should create a new todo and return it with ID', async () => {
      // Arrange
      const newTodoData = {
        title: 'New Task',
        completed: false
      };
      const mockResult = { insertId: 1, affectedRows: 1 };
      db.query.mockResolvedValue(mockResult);
      
      // Act
      const result = await Todo.create(newTodoData);
      
      // Assert
      expect(result).toMatchObject({
        id: 1,
        title: 'New Task',
        completed: false
      });
      expect(result).toHaveProperty('createdAt');
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('INSERT INTO todos SET ?', newTodoData);
    });

    test('should create todo with only title (minimal data)', async () => {
      // Arrange
      const minimalData = { title: 'Simple Task' };
      const mockResult = { insertId: 5 };
      db.query.mockResolvedValue(mockResult);
      
      // Act
      const result = await Todo.create(minimalData);
      
      // Assert
      expect(result.id).toBe(5);
      expect(result.title).toBe('Simple Task');
      expect(result).toHaveProperty('createdAt');
      expect(typeof result.createdAt).toBe('string');
    });

    test('should create todo with all fields', async () => {
      // Arrange
      const fullData = {
        title: 'Complete Task',
        completed: true,
        priority: 'high',
        dueDate: '2026-12-31'
      };
      const mockResult = { insertId: 10 };
      db.query.mockResolvedValue(mockResult);
      
      // Act
      const result = await Todo.create(fullData);
      
      // Assert
      expect(result).toMatchObject({
        id: 10,
        ...fullData
      });
    });

    test('should handle duplicate entry errors', async () => {
      // Arrange - Mock duplicate entry error
      const duplicateError = new Error('Duplicate entry');
      duplicateError.code = 'ER_DUP_ENTRY';
      db.query.mockRejectedValue(duplicateError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Duplicate' })).rejects.toThrow('Duplicate todo');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle general database insertion errors', async () => {
      // Arrange
      const dbError = new Error('Insert failed');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert
      await expect(Todo.create({ title: 'Test' })).rejects.toThrow('Failed to create todo');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== Integration Test ====================
  describe('Create and Retrieve Workflow', () => {
    
    test('should create a todo and then retrieve it', async () => {
      // Step 1: Create a new todo
      const newTodo = { title: 'Integration Test', completed: false };
      db.query.mockResolvedValueOnce({ insertId: 100 });
      
      const created = await Todo.create(newTodo);
      expect(created.id).toBe(100);
      expect(created.title).toBe('Integration Test');
      
      // Step 2: Retrieve the created todo by ID
      const mockRetrievedTodo = { 
        id: 100, 
        title: 'Integration Test', 
        completed: false,
        createdAt: created.createdAt 
      };
      db.query.mockResolvedValueOnce([mockRetrievedTodo]);
      
      const retrieved = await Todo.getById(100);
      expect(retrieved.id).toBe(100);
      expect(retrieved.title).toBe('Integration Test');
      
      // Verify both operations were called
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== Mock Verification Tests ====================
  describe('Database Mock Verification', () => {
    
    test('should verify database query is called with correct SQL', async () => {
      // Arrange
      db.query.mockResolvedValue([]);
      
      // Act
      await Todo.getAll();
      
      // Assert - Verify exact SQL query
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos ORDER BY createdAt DESC');
    });

    test('should verify database query is called with correct parameters', async () => {
      // Arrange
      db.query.mockResolvedValue([{ id: 5, title: 'Test' }]);
      
      // Act
      await Todo.getById(5);
      
      // Assert - Verify SQL and parameters
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM todos WHERE id = ?',
        [5]
      );
    });

    test('should not call database if method is not invoked', () => {
      // Assert - Verify no calls were made
      expect(db.query).not.toHaveBeenCalled();
      expect(db.query).toHaveBeenCalledTimes(0);
    });
  });
});
