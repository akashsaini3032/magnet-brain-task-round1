


import { Link, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaTasks, FaHome, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const username = localStorage.getItem("username");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      {/* ===== Top Header ===== */}
      <header
        style={{
          backgroundColor: "#4e73df",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <FaUserCircle size={30} />
          <h3 style={{ margin: 0 }}>User Dashboard</h3>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.95rem" }}>
            Welcome, <strong>{username}</strong>
          </div>
          <button
            onClick={logout}
            style={{
              backgroundColor: "#e74a3b",
              border: "none",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "4px",
              fontSize: "0.85rem",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74a3b")}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* ===== Sidebar + Content Layout ===== */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "240px",
            backgroundColor: "#2e2e38",
            color: "white",
            paddingTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
          }}
        >
          <Nav className="flex-column" style={{ gap: "10px", padding: "0 1rem" }}>
            <Nav.Link
              as={Link}
              to=""
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 15px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#4e73df")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <FaHome /> Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="mytask"
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 15px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#4e73df")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <FaTasks /> My Tasks
            </Nav.Link>
          </Nav>

          {/* Footer inside sidebar */}
          <div
            style={{
              marginTop: "auto",
              padding: "1rem",
              fontSize: "0.85rem",
              color: "#aaa",
              textAlign: "center",
            }}
          >
            <div>© 2025 Task Manager</div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            backgroundColor: "#f8f9fc",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              minHeight: "75vh",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div> 
  );
};

export default UserDashboard;

