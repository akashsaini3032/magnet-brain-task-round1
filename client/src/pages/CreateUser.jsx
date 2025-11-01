

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BackEndUrl from '../config/BackendUrl';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateUser = () => {
  const [userid, setUserid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userid || !name || !email || !designation) {
      Swal.fire("All fields are required!", "", "warning");
      return;
    }

    try {
      let api = `${BackEndUrl}/admin/usercreation`;
      const response = await axios.post(api, {
        userid,
        name,
        email,
        designation,
      });

      Swal.fire("Success!", response.data.msg || "User created & email sent.", "success");
      setUserid("");
      setName("");
      setEmail("");
      setDesignation("");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.msg || "Failed to create user", "error");
    }
  };

  return (
    <>
      <h2 className="text-center mb-3">👤 Create New User</h2>
      <Form style={{ width: "350px", margin: "auto" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>User ID (Manual)</Form.Label>
          <Form.Control
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder="Enter custom user ID (e.g. USR001)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Designation</Form.Label>
          <Form.Select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option>--Select Designation--</option>
            <option>Programmer</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>Database Developer</option>
            <option>Analyst</option>
            <option>Coder</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: "100%" }}>
          Create User
        </Button>
      </Form>
    </>
  );
};

export default CreateUser;
