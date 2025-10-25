import "../styles/ProductCard.css";

export default function ProductCard({ producto }) {
  return (
    <div className="product-card">
      <img
        src={producto.imagen || "/placeholder.png"}
        alt={producto.nombre}
        className="product-img"
      />
      <h3 className="product-name">{producto.nombre}</h3>
      <p className="product-price">${producto.precio}</p>
      <button className="btn-add">Agregar al carrito</button>
    </div>
  );
}
