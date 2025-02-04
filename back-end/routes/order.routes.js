const express = require('express');
const {
  createOrderFromCart,
  createCashOrder,
  getOne,
  getOrders,
  cancelOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkOut,
  updateOrderStatus,
  getUserOrders,
  getOrdersByStatus,
  getUserOrdersById 
} = require('../controllers/order.controller');

const router = express.Router();

//create new order from cart by user id (user data) in body (ONLINE PAYMENT)
router.post('/create-order-from-cart', createOrderFromCart); 

//create new order from cart by user id (user data) in body (CASH PAYMENT)
router.post('/create-cash-order', createCashOrder);

//get one order by id
router.get('/:id', getOne);

//get all orders
router.get('/', getOrders);

//update order to paid by id
router.put('/update-to-paid/:id', updateOrderToPaid);

//update order to delivered by id
router.put('/update-to-delivered/:id', updateOrderToDelivered);

//checkout
router.post('/checkout', checkOut);

//update order status by id
router.put('/update-status/:id', updateOrderStatus);

//get user orders
router.get('/user-orders', getUserOrders);

//get orders by status
router.get('/status/:status', getOrdersByStatus);

//get orders by user id
router.get('/user/:userId/orders', getUserOrdersById); 

module.exports = router;