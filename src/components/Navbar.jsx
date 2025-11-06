// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ cartCount }) {
  const location = useLocation();

  const is = (p) => (location.pathname === p ? "active" : "");

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">WebAlmacén 🏪</h1>
      <div className="navbar-links">
        <Link to="/productos" className={is("/productos")}>Productos</Link>
        <Link to="/carrito" className={is("/carrito")}>Carrito ({cartCount})</Link>
        <Link to="/mis-pedidos" className={is("/mis-pedidos")}>Mis Pedidos</Link>
      </div>
    </nav>
  );
}
