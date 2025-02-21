const express = require('express');
const {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  addProductsToShoppingCart,
  removeProductFromCart,
  getProductFromCart,
  decItemFromCart,
  incItemInCart,
  getProductDetailsFromCart,
} = require('../controllers/cart.controller');

const router = express.Router();

// إنشاء سلة جديدة
router.post('/create', createCart);

// الحصول على السلة بواسطة معرف المستخدم
router.get('/:userId', getCartByUserId);

// تحديث السلة بواسطة معرف المستخدم
router.put('/:userId/update', updateCart);

// حذف السلة بواسطة معرف المستخدم
router.delete('/:userId/delete', deleteCart);

// إضافة منتجات إلى السلة
router.post('/add', addProductsToShoppingCart);

// إزالة منتج من السلة
router.delete('/remove/:userId/subInventory/:subInventoryId', removeProductFromCart);

// تقليل كمية منتج في السلة
router.put('/dec/:userId/subInventory/:subInventoryId', decItemFromCart);

// زيادة كمية منتج في السلة
router.put('/inc/:userId/subInventory/:subInventoryId', incItemInCart);

// استرجاع منتج من السلة
router.get('/:userId/subInventory/:subInventoryId', getProductFromCart);

// استرجاع تفاصيل منتج من السلة
router.get('/:userId/subInventory-details/:subInventoryId', getProductDetailsFromCart);

module.exports = router;
// // Create new cart (user id, items[product id, quantity, price]) in body
// router.post('/', createCart);

// // Retrieve cart by user id (user id) in params
// router.get('/:userId', getCartByUserId);

// // Change old cart with new cart (user id) in params
// router.put('/:userId', updateCart);

// // Delete cart by user id (user id) in params
// router.delete('/clear/:userId', deleteCart);

// // Retrieve product from cart by user id and product id (user id, product id) in params
// router.get('/:userId/product/:productId', getProductFromCart);

// // Delete product from cart by user id and product id (user id, product id) in params
// router.delete('/remove/:userId/product/:productId', removeProductFromCart);

// // Decrease quantity of product in cart by user id and product id (user id, product id) in params
// router.put('/dec/:userId/product/:productId', decItemFromCart);

// // Increase quantity of product in cart by user id and product id (user id, product id) in params
// router.put('/inc/:userId/product/:productId', incItemInCart);

// // Update cart with new items (user id, product id, quantity) in body
// router.post('/add', addProductsToShoppingCart);

// // Retrieve product details from cart by user id and product id (user id, product id) in params
// router.get('/:userId/product-details/:productId', getProductDetailsFromCart);

// // Create order
// // router.post('/:userId/order', (req, res, next) => {
// //   console.log(`📌 Received request on: /api/cart/${req.params.userId}/order`);
// //   next();
// // }, createOrder);

// router.post('/create-order', createOrder);


// module.exports = router;

// ///////////////////////////////
// const express = require('express');
// const CartController = require('../controllers/cart.controller');

// const router = express.Router();

// router.get('/:userId', CartController.getCart);
// router.delete('/:userId', CartController.clearCart);
// router.post('/:userId/increase/:productId', CartController.incItemInCart);
// router.post('/:userId/decrease/:productId', CartController.decItemFromCart);

// module.exports = router;
// router.get('/', auth, getCurrentUserShoppingCart);
// router.post('/', auth, addProductsToShoppingCart);
// router.put('/:productId', auth, updateProductInShoppingCart);
// router.delete('/:productId', auth, deleteProductInShoppingCart);
// router.delete('/', auth, clearCart);
