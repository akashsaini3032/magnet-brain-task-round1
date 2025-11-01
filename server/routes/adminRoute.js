 

const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/AdminController");


route.post("/logincheck", AdminController.adminLogin);


route.post("/usercreation", AdminController.createUser);
route.get("/showuserdata", AdminController.showUserData);


route.post("/assigntask", AdminController.assignTask);
route.get("/taskdetail", AdminController.taskDetail);
route.get("/changetaskstatus", AdminController.changeTaskStatus);
route.put("/edittask/:id", AdminController.editTask);
route.delete("/deletetask/:id", AdminController.deleteTask);
route.put("/changepriority", AdminController.changePriority);
route.get("/tasks/paginated", AdminController.getAllTasksPaginated);


route.post("/userlogin", AdminController.userLogin);


route.delete("/deleteuser/:id", AdminController.deleteUser);


module.exports = route;

