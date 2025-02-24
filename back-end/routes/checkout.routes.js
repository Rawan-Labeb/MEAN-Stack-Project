const express = require("express");
const router = express.Router();
const orderController = require("../controllers/checkout.controller");


const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")

// ✅ ربط دالة createOrder في order.controller.js
router.post("/createOrder",authenticaiton, authorize("customer"), orderController.createOrder);

module.exports = router;
