import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ cartCount }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">WebAlmacén 🏪</h1>
      <div className="navbar-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Productos
        </Link>
        <Link
          to="/carrito"
          className={location.pathname === "/carrito" ? "active" : ""}
        >
          Carrito ({cartCount})
        </Link>
      </div>
    </nav>
  );
}
