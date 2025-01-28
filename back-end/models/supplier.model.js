const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true }
});

module.exports = mongoose.model("Supplier", supplierSchema);