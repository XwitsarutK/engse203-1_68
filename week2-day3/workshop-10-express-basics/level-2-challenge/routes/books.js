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
  let books = dataStore.getAllBooks();
  
  // กรองตาม genre
  const { genre, page, limit } = req.query;
  if (genre) {
    books = books.filter(b => b.genre === genre);
  }
  
  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedBooks = books.slice(startIndex, endIndex);
  
  // เพิ่มข้อมูล author
  const booksWithAuthors = paginatedBooks.map(book => {
    const author = dataStore.getAuthorById(book.authorId);
    return {
      ...book,
      author
    };
  });
  
  res.json({
    success: true,
    count: books.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(books.length / limitNum),
    data: booksWithAuthors
  });
});

/**
 * GET /api/books/search - Search books
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Search query parameter "q" is required'
      }
    });
  }
  
  const books = dataStore.getAllBooks();
  const searchResults = books.filter(book => 
    book.title.toLowerCase().includes(q.toLowerCase())
  );
  
  // เพิ่มข้อมูล author
  const resultsWithAuthors = searchResults.map(book => {
    const author = dataStore.getAuthorById(book.authorId);
    return {
      ...book,
      author
    };
  });
  
  res.json({
    success: true,
    count: resultsWithAuthors.length,
    data: resultsWithAuthors
  });
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const book = dataStore.getBookById(id);
  
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  
  const author = dataStore.getAuthorById(book.authorId);
  
  res.json({
    success: true,
    data: {
      ...book,
      author
    }
  });
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  // ตรวจสอบว่า authorId มีอยู่จริง
  const author = dataStore.getAuthorById(req.body.authorId);
  if (!author) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  
  const newBook = dataStore.addBook(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  const id = parseInt(req.params.id);
  
  // ตรวจสอบว่า authorId มีอยู่จริง
  const author = dataStore.getAuthorById(req.body.authorId);
  if (!author) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    return next(error);
  }
  
  const updatedBook = dataStore.updateBook(id, req.body);
  
  if (!updatedBook) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  
  res.json({
    success: true,
    message: 'Book updated successfully',
    data: updatedBook
  });
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const deletedBook = dataStore.deleteBook(id);
  
  if (!deletedBook) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  
  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook
  });
});

module.exports = router;