


const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  compday: { type: Number },
  userid: { type: mongoose.Types.ObjectId, ref: "user" },
  taskstatus: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"], // 🔥 only allows these values
    default: "Medium", // default priority
  },
}, { timestamps: true }); // helpful for sorting later

module.exports = mongoose.model("task", taskSchema);
