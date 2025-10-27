import "../styles/Carrito.css";

export default function Carrito({ carrito, setCarrito }) {
  const total = carrito.reduce((acc, p) => acc + p.price, 0);

  const eliminar = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
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
                  <span>${p.price}</span>
                </div>
                <button onClick={() => eliminar(p.id)}>❌</button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <p>Total: ${total.toFixed(2)}</p>
            <button className="btn-finalizar">Finalizar compra</button>
          </div>
        </>
      )}
    </div>
  );
}
