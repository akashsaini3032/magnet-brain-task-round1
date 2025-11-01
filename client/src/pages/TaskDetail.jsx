

import { useState, useEffect } from "react";
import axios from "axios";
import BackEndUrl from "../config/BackendUrl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const TaskDetail = () => {
  const [tasks, setTasks] = useState([]);
  const [editData, setEditData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  const loadData = async () => {
    try {
      const res = await axios.get(`${BackEndUrl}/admin/taskdetail`);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const updatePriority = async (id, priority) => {
    try {
      await axios.put(`${BackEndUrl}/admin/changepriority`, { id, priority });
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the task.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BackEndUrl}/admin/deletetask/${id}`);
        Swal.fire("Deleted!", "Task has been deleted.", "success");
        loadData();
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };


  const handleEditShow = (task) => {
    setEditData(task);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BackEndUrl}/admin/edittask/${editData._id}`, {
        title: editData.title,
        description: editData.description,
        compday: editData.compday,
      });
      setShowEditModal(false);
      Swal.fire("Updated!", "Task updated successfully!", "success");
      loadData();
    } catch (error) {
      Swal.fire("Error!", "Failed to update task.", "error");
    }
  };


  const changeTaskStatus = async (id) => {
    try {
      await axios.get(`${BackEndUrl}/admin/changetaskstatus/?id=${id}`);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };


  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newPriority = destination.droppableId;
    updatePriority(draggableId, newPriority);
  };

  const priorities = ["High", "Medium", "Low"];
  const priorityColors = {
    High: "#ff6b6b",
    Medium: "#feca57",
    Low: "#1dd1a1",
  };

  return (
    <>
      <h2 className="text-center mt-3 mb-4">Priority Management Board</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="d-flex justify-content-around gap-3 flex-wrap">
          {priorities.map((priority) => (
            <Droppable droppableId={priority} key={priority}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-3 rounded shadow-sm"
                  style={{
                    backgroundColor: priorityColors[priority],
                    width: "30%",
                    minWidth: "280px",
                    minHeight: "500px",
                  }}
                >
                  <h5 className="text-center mb-3">{priority} Priority</h5>

                  {tasks
                    .filter((task) => task.priority === priority)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white border rounded p-2 mb-2 shadow-sm"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>{task.title}</strong>
                              <span
                                className={`badge ${
                                  task.taskstatus
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => changeTaskStatus(task._id)}
                              >
                                {task.taskstatus ? "Complete" : "Pending"}
                              </span>
                            </div>
                            <p className="m-0 text-muted small">
                              {task.description}
                            </p>
                            <small className="text-secondary">
                              Due: {task.compday}
                            </small>

                            <div className="mt-2 d-flex justify-content-end gap-2">
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEditShow(task)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteTask(task._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>


      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editData.title || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={editData.description || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Completion Day</Form.Label>
              <Form.Control
                type="text"
                name="compday"
                value={editData.compday || ""}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskDetail;
