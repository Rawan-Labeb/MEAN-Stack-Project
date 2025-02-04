const mongoose = require("mongoose");

 const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    image: { type: String },
    quantity: { type: Number, default: 1, min: 1,required: true },
    price: { type: Number, required: true },
  }],
});

module.exports = mongoose.model("Cart", cartSchema);

