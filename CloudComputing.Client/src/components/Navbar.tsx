import { NavLink, useNavigate } from "react-router-dom";
import "./NavbarStyle.css";
import { useAuth } from "../auth/AuthService";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <span className="navbar-name">Υπολογιστική Νέφους και Υπηρεσίες</span>

      <div className="navbar-links">
        <NavLink className={({ isActive }) => isActive ? "button-blue button-blue-enabled" : "button-blue" } to="/">Αρχική</NavLink>
        <NavLink className={({ isActive }) => isActive ? "button-blue button-blue-enabled" : "button-blue" } to="/ex1">Εργασία 1</NavLink>

        { /* Show logout button when logged in */ }
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ "marginLeft": "20px" }} className="button-blue button-danger">Έξοδος</button>
        )}
      </div>
    </nav>
  )
}

export default Navbar;