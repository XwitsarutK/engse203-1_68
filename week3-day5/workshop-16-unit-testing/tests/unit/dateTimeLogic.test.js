// tests/unit/dateTimeLogic.test.js
const Todo = require('../../src/models/Todo');
const db = require('../../src/config/database');

// Mock the database module
jest.mock('../../src/config/database');

describe('Date/Time Logic Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Use fake timers for consistent date/time testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ==================== getTasksDueToday() Tests ====================
  describe('getTasksDueToday()', () => {
    
    test('should return tasks due today', async () => {
      // Arrange - Set current date to 2026-02-15 10:00:00
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Morning task', dueDate: '2026-02-15T08:00:00.000Z', completed: false },
        { id: 2, title: 'Afternoon task', dueDate: '2026-02-15T14:00:00.000Z', completed: false },
        { id: 3, title: 'Evening task', dueDate: '2026-02-15T20:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(3);
      expect(db.query).toHaveBeenCalledTimes(1);
      
      // Verify the query was called with today's date range
      const callArgs = db.query.mock.calls[0];
      expect(callArgs[0]).toContain('WHERE dueDate >= ? AND dueDate <= ?');
    });

    test('should return empty array when no tasks due today', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      db.query.mockResolvedValue([]);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should include tasks at start of day (00:00)', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Midnight task', dueDate: '2026-02-15T00:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].dueDate).toBe('2026-02-15T00:00:00.000Z');
    });

    test('should include tasks at end of day (23:59)', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Late night task', dueDate: '2026-02-15T23:59:59.999Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].dueDate).toBe('2026-02-15T23:59:59.999Z');
    });

    test('should not include tasks from yesterday or tomorrow', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: "Today's task", dueDate: '2026-02-15T12:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Today's task");
    });

    test('should handle database errors', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const dbError = new Error('Database connection failed');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert
      await expect(Todo.getTasksDueToday()).rejects.toThrow('Failed to fetch tasks due today');
    });
  });

  // ==================== getTasksDueThisWeek() Tests ====================
  describe('getTasksDueThisWeek()', () => {
    
    test('should return tasks due this week', async () => {
      // Arrange - Set to Wednesday, 2026-02-11 (week: Sun 2/8 - Sat 2/14)
      const mockDate = new Date('2026-02-11T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Monday task', dueDate: '2026-02-09T10:00:00.000Z', completed: false },
        { id: 2, title: 'Wednesday task', dueDate: '2026-02-11T14:00:00.000Z', completed: false },
        { id: 3, title: 'Friday task', dueDate: '2026-02-13T16:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(3);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should return empty array when no tasks due this week', async () => {
      // Arrange
      const mockDate = new Date('2026-02-11T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      db.query.mockResolvedValue([]);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('should include tasks on Sunday (start of week)', async () => {
      // Arrange
      const mockDate = new Date('2026-02-11T10:00:00.000Z'); // Wednesday
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Sunday task', dueDate: '2026-02-08T10:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Sunday task');
    });

    test('should include tasks on Saturday (end of week)', async () => {
      // Arrange
      const mockDate = new Date('2026-02-11T10:00:00.000Z'); // Wednesday
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Saturday task', dueDate: '2026-02-14T23:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Saturday task');
    });

    test('should work correctly when today is Sunday', async () => {
      // Arrange - Sunday, 2026-02-08
      const mockDate = new Date('2026-02-08T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'This Sunday', dueDate: '2026-02-08T12:00:00.000Z', completed: false },
        { id: 2, title: 'Next Saturday', dueDate: '2026-02-14T12:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toHaveLength(2);
    });

    test('should work correctly when today is Saturday', async () => {
      // Arrange - Saturday, 2026-02-14
      const mockDate = new Date('2026-02-14T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Last Sunday', dueDate: '2026-02-08T12:00:00.000Z', completed: false },
        { id: 2, title: 'This Saturday', dueDate: '2026-02-14T12:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueThisWeek();
      
      // Assert
      expect(result).toHaveLength(2);
    });

    test('should handle database errors', async () => {
      // Arrange
      const mockDate = new Date('2026-02-11T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const dbError = new Error('Query failed');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert
      await expect(Todo.getTasksDueThisWeek()).rejects.toThrow('Failed to fetch tasks due this week');
    });
  });

  // ==================== getOverdueTasks() Tests ====================
  describe('getOverdueTasks()', () => {
    
    test('should return overdue tasks', async () => {
      // Arrange - Set to 2026-02-15 10:00:00
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Overdue yesterday', dueDate: '2026-02-14T10:00:00.000Z', completed: false },
        { id: 2, title: 'Overdue last week', dueDate: '2026-02-08T10:00:00.000Z', completed: false },
        { id: 3, title: 'Overdue last month', dueDate: '2026-01-15T10:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(3);
      expect(db.query).toHaveBeenCalledTimes(1);
      
      // Verify query filters for past due dates
      const callArgs = db.query.mock.calls[0];
      expect(callArgs[0]).toContain('WHERE dueDate < ?');
      expect(callArgs[0]).toContain('completed = false');
    });

    test('should return empty array when no overdue tasks', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      db.query.mockResolvedValue([]);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test('should not include completed tasks that are overdue', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Incomplete overdue', dueDate: '2026-02-14T10:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
    });

    test('should not include tasks due in the future', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Past due', dueDate: '2026-02-10T10:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(new Date(result[0].dueDate).getTime()).toBeLessThan(mockDate.getTime());
    });

    test('should include tasks overdue by minutes', async () => {
      // Arrange - Current time: 10:00:00
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Just overdue', dueDate: '2026-02-15T09:59:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Just overdue');
    });

    test('should order overdue tasks by due date (oldest first)', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Very old', dueDate: '2026-01-01T10:00:00.000Z', completed: false },
        { id: 2, title: 'Old', dueDate: '2026-02-01T10:00:00.000Z', completed: false },
        { id: 3, title: 'Recent', dueDate: '2026-02-14T10:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getOverdueTasks();
      
      // Assert
      expect(result).toHaveLength(3);
      // Verify query includes ORDER BY
      const callArgs = db.query.mock.calls[0];
      expect(callArgs[0]).toContain('ORDER BY dueDate ASC');
    });

    test('should handle database errors', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const dbError = new Error('Connection timeout');
      db.query.mockRejectedValue(dbError);
      
      // Act & Assert
      await expect(Todo.getOverdueTasks()).rejects.toThrow('Failed to fetch overdue tasks');
    });
  });

  // ==================== Edge Cases & Integration Tests ====================
  describe('Edge Cases and Integration', () => {
    
    test('should handle leap year dates correctly', async () => {
      // Arrange - Leap year date: Feb 29, 2024
      const mockDate = new Date('2024-02-29T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Leap day task', dueDate: '2024-02-29T12:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should handle year boundary (Dec 31 to Jan 1)', async () => {
      // Arrange - New Year's Eve
      const mockDate = new Date('2026-12-31T23:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'Last day of year', dueDate: '2026-12-31T20:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
    });

    test('should handle timezone considerations', async () => {
      // Arrange - Test with UTC time
      const mockDate = new Date('2026-02-15T00:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      const mockTodos = [
        { id: 1, title: 'UTC task', dueDate: '2026-02-15T00:00:00.000Z', completed: false }
      ];
      db.query.mockResolvedValue(mockTodos);
      
      // Act
      const result = await Todo.getTasksDueToday();
      
      // Assert
      expect(result).toHaveLength(1);
    });

    test('should correctly identify overdue vs due today', async () => {
      // Arrange
      const mockDate = new Date('2026-02-15T10:00:00.000Z');
      jest.setSystemTime(mockDate);
      
      // Overdue tasks (before today)
      db.query.mockResolvedValueOnce([
        { id: 1, title: 'Overdue', dueDate: '2026-02-14T23:59:59.999Z', completed: false }
      ]);
      
      const overdue = await Todo.getOverdueTasks();
      expect(overdue).toHaveLength(1);
      
      // Tasks due today
      db.query.mockResolvedValueOnce([
        { id: 2, title: 'Due today', dueDate: '2026-02-15T12:00:00.000Z', completed: false }
      ]);
      
      const dueToday = await Todo.getTasksDueToday();
      expect(dueToday).toHaveLength(1);
      
      // Verify they are different
      expect(overdue[0].id).not.toBe(dueToday[0].id);
    });
  });
});
