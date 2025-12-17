// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar({ cartCount }) {
  const location = useLocation();

  const is = (p) => (location.pathname === p ? "active" : "");

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">
        <Store size={22} style={{ marginRight: 8 }} />
        e-commerce
      </h1>
    </nav>
  );
}
