import { useEffect, useState } from "react";
import { getProductos } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import "../styles/Productos.css";

export default function Productos({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => console.error("❌ Error cargando productos:", err));
  }, []);

  const agregarAlCarrito = (producto) => {
    if (!carrito.some((p) => p.id === producto.id)) {
      setCarrito([...carrito, producto]);
    }
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">🛒 Nuestros Productos</h2>

      {productos.length === 0 ? (
        <p className="no-products">Cargando productos...</p>
      ) : (
        <div className="productos-grid">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              onAgregar={() => agregarAlCarrito(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
