const mongoose = require("mongoose");
const taskSchema= new mongoose.Schema({
    title:String,
    description:String,
    compday:Number,
    userid:{type: mongoose.Types.ObjectId, ref: "user"},
    taskstatus: { type: Boolean, default: false }
})

module.exports = mongoose.model("task", taskSchema);