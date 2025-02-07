const express = require('express');
const router = express.Router();
const {
  getCartByUserId,
  addProductsToShoppingCart,
  updateCart,
  deleteProductFromCart,
  deleteCart,
  createCart
} = require('../controllers/cart.controller');


//craete new cart ( user id , items[ product id , quintity , price ] ) in body
router.post('/', createCart);
// Get user's cart
router.get('/:userId', getCartByUserId);

// Add product to cart
router.post('/add', addProductsToShoppingCart);

// Update product quantity in cart
router.put('/:userId', updateCart);

// Remove product from cart
router.delete('/:userId/product/:productId', deleteProductFromCart);


// Clear cart
router.delete('/:userId', deleteCart);

module.exports = router;
