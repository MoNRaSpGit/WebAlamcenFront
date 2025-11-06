import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProductos } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import GuideBanner from "../components/GuideBanner";
import { useNavigate } from "react-router-dom";
import "../styles/Productos.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Productos({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideSeconds, setGuideSeconds] = useState(5); // ⏱️ cuenta del cartel
  const [highlightId, setHighlightId] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isDemo = useMemo(() => location.state?.demo === true, [location.state]);

  // Carga productos (ahora el back ya devuelve 10)
  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => console.error("❌ Error cargando productos:", err));
  }, []);

  // Si venimos de la demo, mostramos el cartel
  useEffect(() => {
    if (isDemo) setShowGuide(true);
  }, [isDemo]);

  // ⏱️ Cuenta regresiva del cartel y arranque automático
  useEffect(() => {
    if (!showGuide) return;
    if (guideSeconds <= 0) {
      startSimulation(); // inicia solo al terminar el conteo
      return;
    }
    const t = setTimeout(() => setGuideSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showGuide, guideSeconds]);

  // ✅ Usa el setter funcional para evitar "stale state"
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      if (prev.some((p) => p.id === producto.id)) return prev;
      return [...prev, producto];
    });
  };

  // Selección simulada de 3 productos con highlight
  const startSimulation = async () => {
    setShowGuide(false);
    if (productos.length === 0) return;

    // elige 3 distintos (o menos si no hay)
    const shuffled = [...productos].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, Math.min(3, shuffled.length));

    for (const prod of picks) {
      setHighlightId(prod.id);
      await sleep(900);               // highlight previo
      agregarAlCarrito(prod);         // agrega
      await sleep(800);               // mantener resaltado
      setHighlightId(null);
      await sleep(250);               // pausa entre ítems
    }

    // Si querés, luego saltar al carrito:
    navigate("/carrito?demo=1", { state: { demo: true } });
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
              highlight={highlightId === p.id}
            />
          ))}
        </div>
      )}

      {showGuide && (
        <GuideBanner
          title="Simulación de selección"
          text="Ahora vamos a simular la selección de 3 productos. Se agregarán automáticamente al carrito, uno por uno."
          seconds={guideSeconds}
          onClose={startSimulation}     // click en Continuar salta la espera
          actionLabel="Comenzar ahora"
          showCountdown
        />
      )}
    </div>
  );
}
