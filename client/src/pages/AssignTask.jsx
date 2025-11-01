


// import { useState, useEffect } from "react";
// import BackEndUrl from "../config/BackendUrl";
// import axios from "axios";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Swal from "sweetalert2";
// import Select from "react-select";

// const AssignTask = () => {
//   const [users, setUsers] = useState([]);
//   const [input, setInput] = useState({
//     title: "",
//     description: "",
//     complday: "",
//     priority: "Medium",
//   });
//   const [selectedUser, setSelectedUser] = useState(null);

//   // 🔹 Load user data for dropdown
//   const loadData = async () => {
//     let api = `${BackEndUrl}/admin/showuserdata`;
//     try {
//       const response = await axios.get(api);
//       setUsers(
//         response.data.map((user) => ({
//           value: user._id,
//           label: `${user.name} (${user.email})`,
//         }))
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // 🔹 Handle input change
//   const handleInput = (e) => {
//     let { name, value } = e.target;
//     setInput((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🔹 Handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedUser) {
//       Swal.fire("Please select a user!", "", "warning");
//       return;
//     }

//     if (!input.title || !input.description || !input.complday) {
//       Swal.fire("Please fill all fields!", "", "warning");
//       return;
//     }

//     const api = `${BackEndUrl}/admin/assigntask`;

//     try {
//       const response = await axios.post(api, {
//         ...input,
//         userid: selectedUser.value,
//       });

//       Swal.fire("✅ Task Assigned Successfully!", "", "success");

//       // reset form
//       setInput({ title: "", description: "", complday: "", priority: "Medium" });
//       setSelectedUser(null);
//     } catch (error) {
//       console.log(error);
//       Swal.fire("❌ Something went wrong!", "", "error");
//     }
//   };

//   return (
//     <div className="container mt-4" style={{ maxWidth: "600px" }}>
//       <h2 className="text-center mb-4">Assign New Task</h2>

//       <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//         {/* Select User */}
//         <Form.Group className="mb-3">
//           <Form.Label>Select User</Form.Label>
//           <Select
//             options={users}
//             value={selectedUser}
//             onChange={setSelectedUser}
//             placeholder="Search or select a user..."
//             isSearchable
//           />
//         </Form.Group>

//         {/* Task Title */}
//         <Form.Group className="mb-3">
//           <Form.Label>Task Title</Form.Label>
//           <Form.Control
//             type="text"
//             name="title"
//             value={input.title}
//             onChange={handleInput}
//             placeholder="Enter task title"
//           />
//         </Form.Group>

//         {/* Description */}
//         <Form.Group className="mb-3">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             name="description"
//             value={input.description}
//             onChange={handleInput}
//             placeholder="Enter task description"
//           />
//         </Form.Group>

//         {/* Completion Day */}
//         <Form.Group className="mb-3">
//           <Form.Label>Completion Day (in days)</Form.Label>
//           <Form.Control
//             type="number"
//             name="complday"
//             value={input.complday}
//             onChange={handleInput}
//             placeholder="Enter completion days"
//           />
//         </Form.Group>

//         {/* Priority */}
//         <Form.Group className="mb-3">
//           <Form.Label>Priority</Form.Label>
//           <Form.Select
//             name="priority"
//             value={input.priority}
//             onChange={handleInput}
//           >
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </Form.Select>
//         </Form.Group>

//         <div className="text-center">
//           <Button variant="primary" type="submit" className="px-5">
//             Assign Task
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default AssignTask;





import { useState, useEffect } from "react";
import BackEndUrl from "../config/BackendUrl";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import Select from "react-select";

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    complday: "",
    priority: "Medium",
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const loadData = async () => {
    let api = `${BackEndUrl}/admin/showuserdata`;
    try {
      const response = await axios.get(api);
      setUsers(
        response.data.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInput = (e) => {
    let { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      Swal.fire("Please select a user!", "", "warning");
      return;
    }

    if (!input.title || !input.description || !input.complday) {
      Swal.fire("Please fill all fields!", "", "warning");
      return;
    }

    const api = `${BackEndUrl}/admin/assigntask`;

    try {
      await axios.post(api, { ...input, userid: selectedUser.value });
      Swal.fire("✅ Task Assigned Successfully!", "", "success");
      setInput({ title: "", description: "", complday: "", priority: "Medium" });
      setSelectedUser(null);
    } catch (error) {
      Swal.fire("❌ Something went wrong!", "", "error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #eef2ff 0%, #f9fafb 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          width: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px 35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          borderTop: "6px solid #6366f1",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: 600,
            color: "#1e3a8a",
          }}
        >
          Assign New Task
        </h2>

        <Form onSubmit={handleSubmit}>
     
          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 500,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Select User
            </Form.Label>
            <Select
              options={users}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Search or select a user..."
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: 10,
                  borderColor: state.isFocused ? "#6366f1" : "#cbd5e1",
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(99,102,241,0.15)"
                    : "none",
                  "&:hover": { borderColor: "#6366f1" },
                }),
              }}
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 500,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Task Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={input.title}
              onChange={handleInput}
              placeholder="Enter task title"
              style={{
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: "10px 12px",
                backgroundColor: "#f8fafc",
              }}
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 500,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={input.description}
              onChange={handleInput}
              placeholder="Enter task description"
              style={{
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: "10px 12px",
                backgroundColor: "#f8fafc",
              }}
            />
          </Form.Group>

     
          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 500,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Completion Day (in days)
            </Form.Label>
            <Form.Control
              type="number"
              name="complday"
              value={input.complday}
              onChange={handleInput}
              placeholder="Enter days"
              style={{
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: "10px 12px",
                backgroundColor: "#f8fafc",
              }}
            />
          </Form.Group>

       
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: 500,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Priority
            </Form.Label>
            <Form.Select
              name="priority"
              value={input.priority}
              onChange={handleInput}
              style={{
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: "10px 12px",
                backgroundColor: "#f8fafc",
              }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>

          <div style={{ textAlign: "center" }}>
            <Button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                border: "none",
                padding: "12px 40px",
                borderRadius: 10,
                fontWeight: 600,
                letterSpacing: "0.5px",
                boxShadow: "0 6px 15px rgba(99,102,241,0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #3b82f6, #4f46e5)")
              }
              onMouseOut={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #4f46e5, #3b82f6)")
              }
            >
              Assign Task
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AssignTask;


