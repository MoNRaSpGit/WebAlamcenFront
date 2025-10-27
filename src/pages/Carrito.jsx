import "../styles/Carrito.css";
import { enviarPedido } from "../services/pedidosService";
import { useState } from "react";

export default function Carrito({ carrito, setCarrito }) {
  const [loading, setLoading] = useState(false);

  const total = carrito.reduce((acc, p) => acc + parseFloat(p.price || 0), 0);

  const eliminar = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      alert("⚠️ No hay productos en el carrito");
      return;
    }

    const pedido = {
      cliente_nombre: "Cliente Web",
      cliente_contacto: "sin contacto",
      total,
      observaciones: "Pedido generado desde la web",
      productos: carrito.map((p) => ({
        id: p.id,
        cantidad: 1, // si querés más adelante agregamos selección de cantidad
        price: parseFloat(p.price || 0),
      })),
    };

    try {
      setLoading(true);
      const res = await enviarPedido(pedido);
      alert(`✅ Pedido enviado correctamente (ID: ${res.pedido_id})`);
      setCarrito([]); // vaciar carrito
    } catch (err) {
      console.error("❌ Error al enviar pedido:", err);
      alert("Error al enviar el pedido. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carrito-container">
      <h2 className="carrito-title">🧺 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((p) => (
              <li key={p.id} className="carrito-item">
                <img src={p.image || "/placeholder.png"} alt={p.name} />
                <div>
                  <p>{p.name}</p>
                  <span>${parseFloat(p.price || 0).toFixed(2)}</span>
                </div>
                <button onClick={() => eliminar(p.id)}>❌</button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <p>Total: ${total.toFixed(2)}</p>
            <button
              className="btn-finalizar"
              onClick={finalizarCompra}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Finalizar compra"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
