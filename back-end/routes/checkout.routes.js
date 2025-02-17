const express = require('express');
const checkoutController = require('../controllers/checkout.controller');

const router = express.Router();

router.post("/",checkoutController.createOrder);
console.log("✅ checkout.routes.js has been loaded successfully!");

module.exports = router;
