import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-name">Υπολογιστική Νέφους και Υπηρεσίες</span>

      <div className="navbar-links">
        <NavLink className={({ isActive }) => isActive ? "nav-link on-page" : "nav-link" } to="/">Αρχική</NavLink>
        <NavLink className={({ isActive }) => isActive ? "nav-link on-page" : "nav-link" } to="/ex1">Εργασία 1</NavLink>
        <NavLink className={({ isActive }) => isActive ? "nav-link on-page" : "nav-link" } to="/about">Σχετικά</NavLink>
      </div>
    </nav>
  )
}

export default Navbar;