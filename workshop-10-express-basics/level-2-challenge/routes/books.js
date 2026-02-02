// routes/books.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  // TODO: ดึง books ทั้งหมด
  // TODO: กรองตาม genre ถ้ามี
  // TODO: เพิ่ม pagination (page, limit)
  // TODO: เพิ่มข้อมูล author ใน response
  
  // YOUR CODE HERE
  
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  // TODO: หา book
  // TODO: เพิ่มข้อมูล author
  // TODO: ส่ง response
  
  // YOUR CODE HERE
  
});

/**
 * GET /api/books/search - Search books
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  // TODO: ค้นหา books จาก title
  // TODO: ส่ง results
  
  // YOUR CODE HERE
  
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  // TODO: ตรวจสอบว่า authorId มีอยู่จริง
  // TODO: สร้าง book ใหม่
  // TODO: ส่ง response status 201
  
  // YOUR CODE HERE
  
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  // TODO: อัพเดท book
  
  // YOUR CODE HERE
  
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  // TODO: ลบ book
  
  // YOUR CODE HERE
  
});

module.exports = router;