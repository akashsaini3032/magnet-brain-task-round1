




import axios from "axios";
import { useState, useEffect } from "react";
import BackEndUrl from "../config/BackendUrl";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { FaSort, FaSearch, FaTasks } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";

const MyTask = () => {
  const [mydata, setMydata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    let api = `${BackEndUrl}/user/mytask/?id=${localStorage.getItem("userid")}`;
    try {
      const response = await axios.get(api);
      setMydata(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔍 Search Filter
  useEffect(() => {
    const result = mydata.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        (task.priority &&
          task.priority.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredData(result);
  }, [search, mydata]);

  // 🔄 Toggle Task Status (Complete ↔ Pending)
  const toggleTaskStatus = async (id) => {
    const api = `${BackEndUrl}/user/toggle-task-status/?id=${id}`;
    try {
      await axios.get(api);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ⏫ Sorting by priority or completion date
  const sortData = (type) => {
    const sorted = [...filteredData].sort((a, b) => {
      if (type === "priority") {
        const order = { High: 1, Medium: 2, Low: 3 };
        return sortOrder === "asc"
          ? order[a.priority] - order[b.priority]
          : order[b.priority] - order[a.priority];
      } else if (type === "date") {
        return sortOrder === "asc"
          ? new Date(a.compday) - new Date(b.compday)
          : new Date(b.compday) - new Date(a.compday);
      }
      return 0;
    });
    setFilteredData(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 🏷️ Priority Badge Color
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <Badge bg="danger" className="px-3 py-2 rounded-pill shadow-sm">
            🔥 High
          </Badge>
        );
      case "Medium":
        return (
          <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill shadow-sm">
            ⚡ Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge bg="success" className="px-3 py-2 rounded-pill shadow-sm">
            🌿 Low
          </Badge>
        );
      default:
        return <Badge bg="secondary">N/A</Badge>;
    }
  };

  return (
    <motion.div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "#fff",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <Card
          className="border-0 shadow-lg rounded-4 p-4 glass-card"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            color: "#fff",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold text-light">
                <FaTasks className="me-2 text-warning" /> My Tasks
              </h2>

              <Form className="d-flex align-items-center bg-light rounded px-3 py-1">
                <FaSearch color="gray" className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Search task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "250px", border: "none" }}
                />
              </Form>
            </div>

            <div className="d-flex justify-content-end mb-4" style={{ gap: "10px" }}>
              <Button
                variant="outline-light"
                className="shadow-sm hover-glow"
                onClick={() => sortData("priority")}
              >
                <FaSort /> Sort by Priority
              </Button>
              <Button
                variant="outline-warning"
                className="shadow-sm hover-glow"
                onClick={() => sortData("date")}
              >
                <FaSort /> Sort by Due Date
              </Button>
            </div>

            {loading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" variant="light" />
                <p className="mt-2 text-light">Loading tasks...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <p className="text-center text-light">No tasks found 😔</p>
            ) : (
              <Table
                bordered
                hover
                responsive
                className="align-middle table-dark table-hover rounded-4 shadow-sm"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <thead className="table-gradient">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((task) => (
                    <motion.tr
                      key={task._id}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="fw-semibold text-light">{task.title}</td>
                      <td className="fw-semibold text-light">{task.description}</td>
                      <td>{getPriorityBadge(task.priority)}</td>
                      <td>{new Date(task.compday).toLocaleDateString()}</td>
                      <td>
                        {task.taskstatus ? (
                          <Badge bg="success" className="px-3 py-2 rounded-pill">
                            ✅ Completed
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
                            ⏳ Pending
                          </Badge>
                        )}
                      </td>
                      <td>
                        {task.taskstatus ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="shadow-sm hover-glow"
                            onClick={() => toggleTaskStatus(task._id)}
                          >
                            Mark Pending
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="shadow-sm hover-glow"
                            onClick={() => toggleTaskStatus(task._id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </motion.div>
  );
};

export default MyTask;


