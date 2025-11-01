



const UserModel = require("../models/userModel");
const TaskModel = require("../models/taskModel");


const loginCheck = async (req, res) => {
  const { userid, password } = req.body;

  try {
    const User = await UserModel.findOne({ userid });
    if (!User) {
      return res.status(400).send({ msg: "Invalid User ID!" });
    }

    if (User.password !== password) {
      return res.status(400).send({ msg: "Invalid Password!" });
    }

    res.status(200).send({ msg: "Login Successfully!", User });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Server Error" });
  }
};


const myTaskList = async (req, res) => {
  const { id } = req.query;
  try {
    const tasks = await TaskModel.find({ userid: id });
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error fetching tasks" });
  }
};


const toggleTaskStatus = async (req, res) => {
  const { id } = req.query;

  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).send({ msg: "Task not found" });
    }

    const updatedStatus = !task.taskstatus;
    await TaskModel.findByIdAndUpdate(id, { taskstatus: updatedStatus });

    res.status(200).send({
      msg: `Task marked as ${updatedStatus ? "Complete" : "Pending"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error updating task status" });
  }
};

module.exports = {
  loginCheck,
  myTaskList,
  toggleTaskStatus,
};
