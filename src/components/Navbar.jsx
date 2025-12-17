// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ cartCount }) {
  const location = useLocation();

  const is = (p) => (location.pathname === p ? "active" : "");

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">WebAlmacén 🏪</h1>
     
    </nav>
  );
}
