// src/models/Todo.js
const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด (พร้อม filter, search, pagination)
   * @param {Object} filters - { done, search, limit, offset }
   */
  getAll(filters = {}) {
    let sql = 'SELECT * FROM todos';
    const params = [];
    const conditions = [];
    
    // Filter by done status
    if (filters.done !== undefined) {
      conditions.push('done = ?');
      params.push(filters.done ? 1 : 0);
    }
    
    // Search in task (case-insensitive)
    if (filters.search) {
      conditions.push('LOWER(task) LIKE LOWER(?)');
      params.push(`%${filters.search}%`);
    }
    
    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC';
    
    // Pagination
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset !== undefined) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    return this.db.prepare(sql).all(...params);
  }

  /**
   * นับจำนวน todos ทั้งหมด (สำหรับ pagination)
   */
  count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM todos';
    const params = [];
    const conditions = [];
    
    // Filter by done status
    if (filters.done !== undefined) {
      conditions.push('done = ?');
      params.push(filters.done ? 1 : 0);
    }
    
    // Search in task (case-insensitive)
    if (filters.search) {
      conditions.push('LOWER(task) LIKE LOWER(?)');
      params.push(`%${filters.search}%`);
    }
    
    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    const result = this.db.prepare(sql).get(...params);
    return result.total;
  }

  /**
   * ดึง todo ตาม ID
   */
  getById(id) {
    const sql = 'SELECT * FROM todos WHERE id = ?';
    return this.db.prepare(sql).get(id);
  }

  /**
   * สร้าง todo ใหม่
   */
  create(task) {
    const sql = 'INSERT INTO todos (task) VALUES (?)';
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  /**
   * อัพเดทสถานะ
   */
  updateStatus(id, done) {
    const sql = 'UPDATE todos SET done = ? WHERE id = ?';
    const result = this.db.prepare(sql).run(done, id);
    return result.changes === 0 ? null : this.getById(id);
  }

  /**
   * ลบ todo
   */
  delete(id) {
    const sql = 'DELETE FROM todos WHERE id = ?';
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * ดูสถิติ
   */
  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();