


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import BackEndUrl from '../config/BackendUrl';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default is admin
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let api;
      let payload;

      if (role === "admin") {
        api = `${BackEndUrl}/admin/logincheck`;
        payload = { adminid: loginId, password };
      } else {
        api = `${BackEndUrl}/admin/userlogin`;
        payload = { userid: loginId, password };
      }

      const response = await axios.post(api, payload);

      if (role === "admin") {
        localStorage.setItem("role", "admin");
        localStorage.setItem("adminuser", response.data.admin.name);
        navigate("admindashboard");
      } else {
        localStorage.setItem("role", "user");
        localStorage.setItem("username", response.data.User.name);
        localStorage.setItem("userid", response.data.User._id);
        navigate("userdashboard");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Invalid credentials");
    }
  };

  return (
    <>
      <h2 align="center">Login Form</h2>
      <Form style={{ width: "400px", margin: "auto" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Role</Form.Label>
          <Form.Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{role === "admin" ? "Enter Admin ID" : "Enter User ID"}</Form.Label>
          <Form.Control
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder={role === "admin" ? "Admin ID" : "User ID"}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: "100%" }}>
          Login
        </Button>
      </Form>
    </>
  );
};

export default Home;

