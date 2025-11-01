

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true, // must be unique so users can login by ID
    trim: true,
    uppercase: true, // optional: keep IDs uppercase
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  designation: { type: String, default: "" },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
