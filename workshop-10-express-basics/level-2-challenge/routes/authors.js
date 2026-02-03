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
  let authors = dataStore.getAllAuthors();
  
  const { country } = req.query;
  if (country) {
    authors = authors.filter(a => a.country === country);
  }
  
  res.json({
    success: true,
    count: authors.length,
    data: authors
  });
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const author = dataStore.getAuthorById(id);
  
  if (!author) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  
  const books = dataStore.getBooksByAuthor(id);
  
  res.json({
    success: true,
    data: {
      ...author,
      books
    }
  });
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
  const id = parseInt(req.params.id);
  const updatedAuthor = dataStore.updateAuthor(id, req.body);
  
  if (!updatedAuthor) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  
  res.json({
    success: true,
    message: 'Author updated successfully',
    data: updatedAuthor
  });
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  
  // ตรวจสอบว่ามี books หรือไม่
  const books = dataStore.getBooksByAuthor(id);
  if (books.length > 0) {
    const error = new Error('Cannot delete author with existing books');
    error.statusCode = 400;
    return next(error);
  }
  
  const deletedAuthor = dataStore.deleteAuthor(id);
  
  if (!deletedAuthor) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  
  res.json({
    success: true,
    message: 'Author deleted successfully',
    data: deletedAuthor
  });
});

module.exports = router;