// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validator = require('../validators/productValidator');

/**
 * GET /api/products
 * Get all products (with filters)
 */
router.get('/',
  validator.validateQuery,
  validator.handleValidationErrors,
  productController.getAll
);

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.getById
);

/**
 * POST /api/products
 * Create new product
 */
router.post('/',
  validator.createProduct,
  validator.handleValidationErrors,
  productController.create
);

/**
 * PUT /api/products/:id
 * Update product (full replacement)
 */
router.put('/:id',
  validator.updateProduct,
  validator.handleValidationErrors,
  productController.update
);

/**
 * PATCH /api/products/:id
 * Partial update product
 */
router.patch('/:id',
  validator.patchProduct,
  validator.handleValidationErrors,
  productController.partialUpdate
);

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.remove
);

module.exports = router;