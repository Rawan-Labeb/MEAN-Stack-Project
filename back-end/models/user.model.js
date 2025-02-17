const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: "customer",
    enum: ["customer", "seller", "admin", "manager"],
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
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

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, this.salt);
//   }
//   next();
// });

userSchema.methods.comparePassword = async function (candidatePassword) {
  const hash = await bcrypt.hash(candidatePassword, this.salt);
  return hash == this.password;
};


module.exports = mongoose.model("User", userSchema);