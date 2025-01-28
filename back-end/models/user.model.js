const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["Customer", "Seller", "Admin", "Manager"],
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
  },
  contactNo: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);