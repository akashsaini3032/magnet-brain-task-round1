


const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const TaskModel = require("../models/taskModel");
const userPassword = require("../middlewares/randomPassword");
const nodemailer = require("nodemailer");

const User = require("../models/userModel");
const Task = require("../models/taskModel");

// === Helper: create transporter using env variables (recommended) ===
const createTransporter = () => {
  // Use environment variables in production: process.env.MAIL_USER, process.env.MAIL_PASS
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER || "", // set in .env
      pass: process.env.MAIL_PASS || "", // set in .env (app password)
    },
  });
};

// ---------------- Admin Login ----------------
const adminLogin = async (req, res) => {
  const { adminid, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ id: adminid });
    if (!admin) return res.status(401).send({ msg: "Invalid Admin ID" });

    if (admin.password !== password)
      return res.status(401).send({ msg: "Invalid Password" });

    res.status(200).send({ admin, msg: "Admin Login Successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Server error" });
  }
};

// ---------------- Create User (manual User ID + email credentials) ----------------
const createUser = async (req, res) => {
  const { userid, name, email, designation } = req.body;

  try {
    // 1. Validate inputs
    if (!userid || !name || !email || !designation) {
      return res.status(400).send({ msg: "All fields are required!" });
    }

    // Normalize userid and email
    const normalizedId = String(userid).trim().toUpperCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    // 2. Check duplicates (by userid or email)
    const existing = await UserModel.findOne({
      $or: [{ userid: normalizedId }, { email: normalizedEmail }],
    });

    if (existing) {
      return res.status(400).send({ msg: "User ID or Email already exists!" });
    }

    // 3. Generate password
    const UserPass = userPassword(); // your existing random password middleware

    // 4. Create user
    const newUser = await UserModel.create({
      userid: normalizedId,
      name: name.trim(),
      email: normalizedEmail,
      designation: designation.trim(),
      password: UserPass,
    });

    // 5. Send credentials email
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.MAIL_FROM || "no-reply@taskapp.local",
      to: normalizedEmail,
      subject: "Your Task Management System - Credentials",
      text: `Hello ${name},

Your account has been created.

User ID: ${normalizedId}
Email: ${normalizedEmail}
Password: ${UserPass}

Please login using your User ID and Password. We recommend changing the password after first login.

Regards,
Admin Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
        // We created the user successfully but email failed to send
        return res.status(201).send({
          msg: "User created but email failed to send.",
          user: { userid: normalizedId, email: normalizedEmail },
        });
      } else {
        console.log("Email sent:", info.response);
        return res.status(201).send({
          msg: "User created successfully and email sent!",
          user: { userid: normalizedId, email: normalizedEmail },
        });
      }
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).send({ msg: "Server error while creating user" });
  }
};

// ---------------- Show all users ----------------
const showUserData = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error fetching users" });
  }
};

// ---------------- Assign Task ----------------
const assignTask = async (req, res) => {
  const { title, description, complday, userid, priority } = req.body;
  try {
    const task = await TaskModel.create({
      title,
      description,
      compday: complday,
      userid,
      priority: priority || "Medium",
    });
    res.status(201).send({ msg: "Task assigned successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error assigning task" });
  }
};

// ---------------- Get All Tasks ----------------
const taskDetail = async (req, res) => {
  try {
    const tasks = await TaskModel.find().populate("userid", "userid name email");
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error fetching tasks" });
  }
};

// ---------------- Change Task Status (toggle) ----------------
const changeTaskStatus = async (req, res) => {
  const { id } = req.query;
  try {
    const task = await TaskModel.findById(id);
    if (!task) return res.status(404).send({ msg: "Task not found" });

    const updatedStatus = !task.taskstatus;
    task.taskstatus = updatedStatus;
    await task.save();

    res.status(200).send({ msg: "Task status updated", task });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error updating status" });
  }
};

// ---------------- Edit Task ----------------
const editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, compday, priority } = req.body;
  try {
    const updated = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, compday, priority },
      { new: true }
    );
    res.status(200).send({ msg: "Task updated", updated });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error updating task" });
  }
};

// ---------------- Delete Task ----------------
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await TaskModel.findByIdAndDelete(id);
    res.status(200).send({ msg: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error deleting task" });
  }
};

// ---------------- Change Priority ----------------
const changePriority = async (req, res) => {
  const { id, priority } = req.body;
  try {
    await TaskModel.findByIdAndUpdate(id, { priority });
    res.status(200).send({ msg: "Priority updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error updating priority" });
  }
};

// ---------------- Pagination (tasks) ----------------
const getAllTasksPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, userId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const filter = userId ? { userid: userId } : {};

    const tasks = await TaskModel.find(filter)
      .populate("userid", "userid name email designation")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await TaskModel.countDocuments(filter);
    const totalUsers = await UserModel.countDocuments();

    res.status(200).send({
      tasks,
      totalTasks,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error fetching paginated tasks" });
  }
};

// ---------------- User Login (by userid) ----------------
const userLogin = async (req, res) => {
  const { userid, password } = req.body;
  try {
    if (!userid || !password) return res.status(400).send({ msg: "Provide userid and password" });

    const normalizedId = String(userid).trim().toUpperCase();
    const user = await UserModel.findOne({ userid: normalizedId });
    if (!user) return res.status(401).send({ msg: "Invalid User ID" });

    if (user.password !== password) return res.status(401).send({ msg: "Invalid Password" });

    res.status(200).send({ msg: "Login Successful", User: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error logging in user" });
  }
};




const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user first
    await User.findByIdAndDelete(userId);

    // Delete all tasks of that user
    await Task.deleteMany({ userid: userId });

    res.json({ msg: "User and their tasks deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ msg: "Failed to delete user" });
  }
};


module.exports = {
  adminLogin,
  createUser,
  showUserData,
  assignTask,
  taskDetail,
  changeTaskStatus,
  editTask,
  deleteTask,
  changePriority,
  getAllTasksPaginated,
  userLogin,
  deleteUser,
};
