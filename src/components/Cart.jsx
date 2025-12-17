import "../styles/Carrito.css";
import { ShoppingCart, Trash2 } from "lucide-react";

export default function Carrito({ carrito, setCarrito }) {
  const total = carrito.reduce((acc, p) => acc + p.price, 0);

  const eliminar = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  return (
    <div className="carrito-container">
      <h2 className="carrito-title">
        <ShoppingCart size={22} style={{ marginRight: 8 }} />
        Carrito de Compras
      </h2>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((p) => (
              <li key={p.id} className="carrito-item">
                <img src={p.image || "/placeholder.png"} alt={p.name} />

                <div className="carrito-info">
                  <p className="carrito-nombre">{p.name}</p>
                  <span className="carrito-precio">
                    ${p.price.toFixed(2)}
                  </span>
                </div>

                <button
                  className="carrito-eliminar"
                  onClick={() => eliminar(p.id)}
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <p>Total: ${total.toFixed(2)}</p>
            <button className="btn-finalizar">
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
