


import { useState, useEffect } from "react";
import axios from "axios";
import BackEndUrl from "../config/BackendUrl";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const TaskOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  const limit = 5; // tasks per page

  // 🔹 Load all users
  const loadUsers = async () => {
    try {
      const res = await axios.get(`${BackEndUrl}/admin/showuserdata`);
      setUsers(res.data);
      setTotalUsers(res.data.length);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  // 🔹 Load paginated tasks
  const loadTasks = async (page = 1, userId = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${BackEndUrl}/admin/tasks/paginated`, {
        params: { page, limit, userId },
      });
      setTasks(res.data.tasks);
      setTotalTasks(res.data.totalTasks);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
  }, []);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    loadTasks(1, userId);
  };

  // 🔹 Edit Task Modal open
  const handleEdit = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  // 🔹 Save Edited Task
  const handleSaveEdit = async () => {
    try {
      await axios.put(`${BackEndUrl}/admin/edittask/${editTask._id}`, {
        title: editTask.title,
        description: editTask.description,
        compday: editTask.compday,
      });
      Swal.fire("✅ Success", "Task updated successfully!", "success");
      setShowEditModal(false);
      loadTasks(currentPage, selectedUser);
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Error updating task", "error");
    }
  };

  // 🔹 Delete Task
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BackEndUrl}/admin/deletetask/${id}`);
        Swal.fire("Deleted!", "Task has been deleted.", "success");
        loadTasks(currentPage, selectedUser);
      } catch (err) {
        Swal.fire("❌ Error", "Failed to delete task.", "error");
      }
    }
  };

  // 🔹 Toggle Status (Pending ↔ Complete)
  const toggleStatus = async (id) => {
    try {
      await axios.get(`${BackEndUrl}/admin/changetaskstatus?id=${id}`);
      loadTasks(currentPage, selectedUser);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Change Priority
  const handlePriorityChange = async (id, newPriority) => {
    try {
      await axios.put(`${BackEndUrl}/admin/changepriority`, {
        id,
        priority: newPriority,
      });
      loadTasks(currentPage, selectedUser);
    } catch (err) {
      console.error("Error changing priority:", err);
    }
  };

  // 🔹 Delete User
  const handleDeleteUser = async (userId) => {
    const confirm = await Swal.fire({
      title: "Delete User?",
      text: "This will delete user and all their tasks.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BackEndUrl}/admin/deleteuser/${userId}`);
        Swal.fire("Deleted!", "User deleted successfully!", "success");
        loadUsers();
        loadTasks();
      } catch (err) {
        Swal.fire("❌ Error", "Failed to delete user.", "error");
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) loadTasks(currentPage - 1, selectedUser);
  };

  const handleNext = () => {
    if (currentPage < totalPages) loadTasks(currentPage + 1, selectedUser);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">📋 Task Overview</h2>

      {/* 🔹 Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>Total Users:</strong> {totalUsers} |{" "}
          <strong>Total Tasks:</strong> {totalTasks}
        </div>

        <div className="d-flex gap-2">
          <Form.Select
            value={selectedUser}
            onChange={handleUserChange}
            style={{ width: "250px" }}
          >
            <option value="">-- Filter by User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </Form.Select>

          <Button
            variant="outline-secondary"
            onClick={() => setShowUserModal(true)}
          >
            👥 Manage Users
          </Button>
        </div>
      </div>

      {/* 🔹 Tasks Table */}
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center mt-4">No tasks found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Completion Day</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={task.priority}
                    onChange={(e) =>
                      handlePriorityChange(task._id, e.target.value)
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </td>
                <td>{task.compday}</td>
                <td>
                  <Button
                    size="sm"
                    variant={task.taskstatus ? "success" : "danger"}
                    onClick={() => toggleStatus(task._id)}
                  >
                    {task.taskstatus ? "Complete ✅" : "Pending ⏳"}
                  </Button>
                </td>
                <td>{task.userid?.name}</td>
                <td>{task.userid?.email}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(task)}
                  >
                    ✏ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    🗑 Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* 🔹 Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <Button
          variant="outline-primary"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="me-2"
        >
          ⬅ Prev
        </Button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <Button
          variant="outline-primary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="ms-2"
        >
          Next ➡
        </Button>
      </div>

      {/* 🔹 Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTask?.title || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editTask?.description || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Completion Day</Form.Label>
              <Form.Control
                type="number"
                value={editTask?.compday || ""}
                onChange={(e) =>
                  setEditTask({ ...editTask, compday: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 🔹 Manage Users Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="🔍 Search user..."
            className="mb-3"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.designation}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      🗑 Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskOverview;

