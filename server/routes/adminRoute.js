 

const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/AdminController");

// Admin Authentication
route.post("/logincheck", AdminController.adminLogin);

// User Management
route.post("/usercreation", AdminController.createUser);
route.get("/showuserdata", AdminController.showUserData);

// Task Management
route.post("/assigntask", AdminController.assignTask);
route.get("/taskdetail", AdminController.taskDetail);
route.get("/changetaskstatus", AdminController.changeTaskStatus);
route.put("/edittask/:id", AdminController.editTask);
route.delete("/deletetask/:id", AdminController.deleteTask);
route.put("/changepriority", AdminController.changePriority);
route.get("/tasks/paginated", AdminController.getAllTasksPaginated);

// User Login
route.post("/userlogin", AdminController.userLogin);


route.delete("/deleteuser/:id", AdminController.deleteUser);


module.exports = route;

