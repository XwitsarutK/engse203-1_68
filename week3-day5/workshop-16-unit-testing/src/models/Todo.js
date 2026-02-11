// src/models/Todo.js
const db = require('../config/database');

class Todo {
  /**
   * Get all todos
   */
  static async getAll() {
    try {
      const result = await db.query('SELECT * FROM todos ORDER BY createdAt DESC');
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }
  }
  
  /**
   * Get todo by ID
   */
  static async getById(id) {
    try {
      const result = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
      
      if (result.length === 0) {
        throw new Error('Todo not found');
      }
      
      return result[0];
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to fetch todo: ${error.message}`);
    }
  }
  
  /**
   * Create new todo
   */
  static async create(data) {
    try {
      const result = await db.query('INSERT INTO todos SET ?', data);
      
      return {
        id: result.insertId,
        ...data,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Duplicate todo');
      }
      throw new Error(`Failed to create todo: ${error.message}`);
    }
  }
  
  /**
   * Update todo
   */
  static async update(id, data) {
    try {
      const result = await db.query('UPDATE todos SET ? WHERE id = ?', [data, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      
      return { id, ...data };
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }
  
  /**
   * Delete todo
   */
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM todos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Todo not found');
      }
      
      return true;
    } catch (error) {
      if (error.message === 'Todo not found') {
        throw error;
      }
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }

  /**
   * Get tasks due today
   */
  static async getTasksDueToday() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      const result = await db.query(
        'SELECT * FROM todos WHERE dueDate >= ? AND dueDate <= ? ORDER BY dueDate ASC',
        [startOfDay, endOfDay]
      );
      
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch tasks due today: ${error.message}`);
    }
  }

  /**
   * Get tasks due this week
   */
  static async getTasksDueThisWeek() {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      const result = await db.query(
        'SELECT * FROM todos WHERE dueDate >= ? AND dueDate <= ? ORDER BY dueDate ASC',
        [startOfWeek.toISOString(), endOfWeek.toISOString()]
      );
      
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch tasks due this week: ${error.message}`);
    }
  }

  /**
   * Get overdue tasks
   */
  static async getOverdueTasks() {
    try {
      const now = new Date().toISOString();
      
      const result = await db.query(
        'SELECT * FROM todos WHERE dueDate < ? AND completed = false ORDER BY dueDate ASC',
        [now]
      );
      
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch overdue tasks: ${error.message}`);
    }
  }
}

module.exports = Todo;
