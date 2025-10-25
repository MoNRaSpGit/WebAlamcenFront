import { useEffect, useState } from "react";
import { getProductos } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import "../styles/Productos.css";


export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => console.error("❌ Error cargando productos:", err));
  }, []);

  return (
    <div className="productos-container">
      <h2 className="productos-title">🛒 Nuestros Productos</h2>

      {productos.length === 0 ? (
        <p className="no-products">Cargando productos...</p>
      ) : (
        <div className="productos-grid">
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
