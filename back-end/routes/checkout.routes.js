const express = require("express");
const router = express.Router();
const orderController = require("../controllers/checkout.controller");

// ✅ ربط دالة createOrder في order.controller.js
router.post("/createOrder", orderController.createOrder);

module.exports = router;
