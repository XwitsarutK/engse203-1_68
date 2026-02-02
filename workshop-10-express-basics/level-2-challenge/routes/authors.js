// routes/authors.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get('/', (req, res) => {
  // TODO: ดึง authors ทั้งหมด
  // TODO: ถ้ามี query param 'country' ให้กรองตาม country
  // TODO: ส่ง response พร้อม count และ data
  
  // YOUR CODE HERE
  // ตรวจสอบ query parameter
  const { country } = req.query;
  
  let filteredCountry = country;
  
  // กรองตาม country ถ้ามี
  if (country) {
    filteredCountry = dataStore.getAllAuthors().filter(a => a.country === country);
  } else {
    filteredCountry = dataStore.getAllAuthors();
  }
  
  res.json({
    success: true,
    count: filteredCountry.length,
    data: filteredCountry
  });  
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get('/:id', (req, res, next) => {
  // TODO: แปลง id เป็น number
  // TODO: หา author จาก dataStore
  // TODO: ถ้าไม่เจอ ส่ง 404
  // TODO: ถ้าเจอ ส่ง author พร้อม books ของ author
  
  // YOUR CODE HERE
  
});

/**
 * POST /api/authors - Create new author
 */
router.post('/', validateAuthor, (req, res) => {
  // TODO: สร้าง author ใหม่
  // TODO: ส่ง response status 201
  // { id: 1, name: 'J.K. Rowling', country: 'UK', birthYear: 1965 },
  
  const newAuthor = dataStore.addAuthor(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: newAuthor
  });
});

/**
 * PUT /api/authors/:id - Update author
 */
router.put('/:id', validateAuthor, (req, res, next) => {
  // TODO: อัพเดท author
  // TODO: ถ้าไม่เจอ ส่ง 404
  
  // YOUR CODE HERE
  
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete('/:id', (req, res, next) => {
  // TODO: ลบ author
  // TODO: ตรวจสอบว่า author มี books หรือไม่
  // TODO: ถ้ามี books ไม่ให้ลบ (ส่ง 400)
  
  // YOUR CODE HERE
  
});

module.exports = router;