const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    mobileNo: { type: Number, required: true, index: true, unique: true },
    designation: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
