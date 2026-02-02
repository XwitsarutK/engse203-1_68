// solutions/Member.js
const { db } = require('../db');

class Member {
  /**
   * ดึงสมาชิกทั้งหมด
   */
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  /**
   * ดูหนังสือที่สมาชิกยืมอยู่ (พร้อม JOIN)
   * 🔨 นักศึกษาต้องเขียนเอง
   * 
   * เฉลยนี้ให้มาครบแล้วในโจทย์ เพราะเป็น JOIN ที่สำคัญ
   */
  static getBorrowedBooks(memberId) {
    const sql = `
      SELECT 
        books.title,
        books.author,
        borrowings.borrow_date,
        borrowings.id as borrowing_id
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? 
        AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  /**
   * เพิ่มสมาชิกใหม่
   * 🔨 นักศึกษาต้องเขียนเอง
   */
  static add(name, email, phone) {
    const sql = `
      INSERT INTO members (name, email, phone)
      VALUES (?, ?, ?)
    `;
    const result = db.prepare(sql).run(name, email, phone);
    
    console.log(`✅ Added member: ${name} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }

  /**
   * ดึงสมาชิกตาม ID
   */
  static getById(id) {
    const sql = 'SELECT * FROM members WHERE id = ?';
    return db.prepare(sql).get(id);
  }

  /**
   * ดึงสมาชิกตาม email
   */
  static getByEmail(email) {
    const sql = 'SELECT * FROM members WHERE email = ?';
    return db.prepare(sql).get(email);
  }

  /**
   * นับจำนวนหนังสือที่สมาชิกยืมอยู่
   */
  static countBorrowedBooks(memberId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM borrowings
      WHERE member_id = ? AND return_date IS NULL
    `;
    const result = db.prepare(sql).get(memberId);
    return result.count;
  }
}

module.exports = Member;