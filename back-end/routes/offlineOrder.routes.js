const express = require('express');
const {
  getAllOfflineOrders,
  getAllOrdersByBranchId,
  getOfflineOrderById,
  createOfflineOrder,
  cancelOfflineOrder,
  getBranchById,
  getSubInventoryById,
  deleteProductFromOrder
} = require('../controllers/offline.order.controller');

const router = express.Router();

// Get all offline orders
router.get('/getAllOfflineOrders', getAllOfflineOrders);

// Get offline orders by branch ID
router.get('/getOfflineOrdersByBranchId/:branchId', getAllOrdersByBranchId);

// Get offline order by ID
router.get('/getOfflineOrderbyId/:orderId', getOfflineOrderById);

// Create a new offline order
router.post('/createOfflineOrder', createOfflineOrder);

// Cancel an offline order
router.post('/cancelOfflineOrder/:orderId', cancelOfflineOrder);

// Get branch by ID
router.get('/branch/getBranchById/:branchId', getBranchById);

// Get sub-inventory by ID
router.get('/subInventory/getSubInventoryById/:subInventoryId', getSubInventoryById);

// Delete a product from an order
router.post('/deleteProductFromOrder', deleteProductFromOrder);

module.exports = router;