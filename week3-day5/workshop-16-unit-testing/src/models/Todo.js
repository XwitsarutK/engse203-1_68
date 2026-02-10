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
}

module.exports = Todo;