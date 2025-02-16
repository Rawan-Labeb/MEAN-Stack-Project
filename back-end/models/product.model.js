const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    prevPrice: { type: Number },
    noOfSale: { type: Number, default: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier"
    },
    categoryId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  }, { timestamps: true });
  
module.exports = mongoose.model('Product', productSchema);