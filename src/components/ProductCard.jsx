import "../styles/ProductCard.css";

export default function ProductCard({ producto, onAgregar }) {
  return (
    <div className="product-card">
      <img
        src={producto.image || "/placeholder.png"}
        alt={producto.name}
        className="product-img"
      />
      <h3 className="product-name">{producto.name}</h3>
      <p className="product-price">${producto.price}</p>
      <p className="product-desc">{producto.description || "Sin descripción"}</p>
      <button className="btn-add" onClick={onAgregar}>
        Agregar al carrito
      </button>
    </div>
  );
}
