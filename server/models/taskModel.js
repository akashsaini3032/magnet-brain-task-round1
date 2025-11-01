


const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  compday: { type: Number },
  userid: { type: mongoose.Types.ObjectId, ref: "user" },
  taskstatus: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"], 
    default: "Medium", 
  },
}, { timestamps: true }); 

module.exports = mongoose.model("task", taskSchema);
