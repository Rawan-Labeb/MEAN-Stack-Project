const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true }, // Custom order ID
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true }, 
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Completed", "Cancelled", "Returned", "Refunded"], 
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Online"],
    required: true,
  },
  date: { type: Date, required: true, default: Date.now }, 
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
});

module.exports = mongoose.model("Order", orderSchema);