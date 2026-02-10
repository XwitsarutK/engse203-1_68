// tests/unit/Todo.test.js

// Mock database BEFORE importing Todo
jest.mock('../../src/config/database', () => {
  return require('../__mocks__/database');
});

const Todo = require('../../src/models/Todo');
const db = require('../../src/config/database');

describe('Todo Model', () => {
  
  // Reset mock data before each test
  beforeEach(() => {
    db._reset();
  });
  
  describe('getAll', () => {
    
    // ✅ Positive Tests
    test('should return all todos', async () => {
      const todos = await Todo.getAll();
      
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBe(2);
    });
    
    test('should return todos with correct structure', async () => {
      const todos = await Todo.getAll();
      
      expect(todos[0]).toHaveProperty('id');
      expect(todos[0]).toHaveProperty('task');
      expect(todos[0]).toHaveProperty('done');
      expect(todos[0]).toHaveProperty('priority');
    });
    
    // ❌ Negative Tests
    test('should throw error when database fails', async () => {
      // Mock database error
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.getAll())
        .rejects
        .toThrow('Failed to fetch todos');
    });
  });
  
  describe('getById', () => {
    
    // ✅ Positive Tests
    test('should return todo by ID', async () => {
      const todo = await Todo.getById(1);
      
      expect(todo.id).toBe(1);
      expect(todo.task).toBe('Test todo 1');
    });
    
    test('should return correct todo data', async () => {
      const todo = await Todo.getById(2);
      
      expect(todo.done).toBe(true);
      expect(todo.priority).toBe('low');
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.getById(999))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.getById(1))
        .rejects
        .toThrow('Failed to fetch todo');
    });
  });
  
  describe('create', () => {
    
    // ✅ Positive Tests
    test('should create new todo', async () => {
      const newTodo = {
        task: 'New task',
        done: false,
        priority: 'medium'
      };
      
      const result = await Todo.create(newTodo);
      
      expect(result.id).toBeDefined();
      expect(result.task).toBe('New task');
      expect(result.priority).toBe('medium');
    });
    
    test('should return todo with createdAt', async () => {
      const newTodo = {
        task: 'New task',
        done: false,
        priority: 'high'
      };
      
      const result = await Todo.create(newTodo);
      
      expect(result.createdAt).toBeDefined();
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });
    
    test('should increment ID', async () => {
      const todo1 = await Todo.create({ task: 'Task 1', done: false });
      const todo2 = await Todo.create({ task: 'Task 2', done: false });
      
      expect(todo2.id).toBeGreaterThan(todo1.id);
    });
    
    // ❌ Negative Tests
    test('should throw error for duplicate todo', async () => {
      // Mock duplicate entry error
      jest.spyOn(db, 'query').mockRejectedValueOnce({
        code: 'ER_DUP_ENTRY',
        message: 'Duplicate entry'
      });
      
      await expect(Todo.create({ task: 'Duplicate' }))
        .rejects
        .toThrow('Duplicate todo');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.create({ task: 'Test' }))
        .rejects
        .toThrow('Failed to create todo');
    });
  });
  
  describe('update', () => {
    
    // ✅ Positive Tests
    test('should update existing todo', async () => {
      const updates = { task: 'Updated task', done: true };
      const result = await Todo.update(1, updates);
      
      expect(result.id).toBe(1);
      expect(result.task).toBe('Updated task');
      expect(result.done).toBe(true);
    });
    
    test('should update partial data', async () => {
      const updates = { done: true };
      const result = await Todo.update(1, updates);
      
      expect(result.done).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.update(999, { done: true }))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.update(1, { done: true }))
        .rejects
        .toThrow('Failed to update todo');
    });
  });
  
  describe('delete', () => {
    
    // ✅ Positive Tests
    test('should delete existing todo', async () => {
      const result = await Todo.delete(1);
      expect(result).toBe(true);
    });
    
    test('should actually remove todo from database', async () => {
      await Todo.delete(1);
      
      // Verify it's gone
      await expect(Todo.getById(1))
        .rejects
        .toThrow('Todo not found');
    });
    
    // ❌ Negative Tests
    test('should throw error when todo not found', async () => {
      await expect(Todo.delete(999))
        .rejects
        .toThrow('Todo not found');
    });
    
    test('should throw error when database fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
      
      await expect(Todo.delete(1))
        .rejects
        .toThrow('Failed to delete todo');
    });
  });
});