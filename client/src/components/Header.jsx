




import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const Header = () => {
  const navigate = useNavigate();


  const handleNavClick = (path) => {
    const isLoggedIn = localStorage.getItem("username");
    if (!isLoggedIn) {
      Swal.fire({
        title: "🔐 Login Required",
        text: "Please login to access this page.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#1e3c72",
      });
      return;
    }
    navigate(path);
  };

  const logout = () => {
    localStorage.clear();
    Swal.fire({
      title: "Logged Out!",
      text: "You have been successfully logged out.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/");
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="logo-text">The Task Management System</h1>
      </div>

      <nav className="header-nav">
        <span onClick={() => handleNavClick("/admindashboard")}>Dashboard</span>
        <span onClick={() => handleNavClick("/createuser")}>Create User</span>
        <span onClick={() => handleNavClick("/assigntask")}>Assign Task</span>
        <span onClick={() => handleNavClick("/taskoverview")}>Overview</span>
      </nav>

      
    </header>
  );
};

export default Header;
