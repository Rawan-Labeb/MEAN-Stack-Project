const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Specific routes first
router.get('/admin/all', productController.getAllProductsAdmin);
router.get('/search', productController.searchProducts);
router.get('/price-range', productController.getProductsByPriceRange);
router.get('/best-sellers', productController.getBestSellers);
router.get('/available', productController.getAvailableProducts);
router.get('/seller/:sellerId', productController.getSellerProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.delete('/hard-delete/:id', productController.hardDeleteProduct);
router.patch('/toggle-status/:id', productController.toggleProductStatus);

// Generic CRUD routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;