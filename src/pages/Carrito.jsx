// src/pages/Carrito.jsx
import "../styles/Carrito.css";
import { enviarPedido } from "../services/pedidosService";
import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GuideBanner from "../components/GuideBanner";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Carrito({ carrito, setCarrito, setLastOrder }) {
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [guideSeconds, setGuideSeconds] = useState(4);
  const [pulseFinish, setPulseFinish] = useState(false);
  const [hasShowcased, setHasShowcased] = useState(false);

  const finishBtnRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar modo demo
  const isDemo = useMemo(() => {
    const fromState = location.state?.demo === true;
    const fromQuery = new URLSearchParams(location.search).get("demo") === "1";
    const fromStorage = sessionStorage.getItem("DEMO_FLOW") === "1";
    return fromState || fromQuery || fromStorage;
  }, [location.state, location.search]);

  const total = carrito.reduce((acc, p) => acc + parseFloat(p.price || 0), 0);

  const eliminar = (id) => setCarrito(carrito.filter((p) => p.id !== id));

  // ✅ SIN ALERT: éxito o error navega igual a /mis-pedidos
  const finalizarCompra = async () => {
    if (carrito.length === 0) return;

    const pedido = {
      cliente_nombre: "Cliente Web",
      cliente_contacto: "sin contacto",
      total,
      observaciones: "Pedido generado desde la web (demo)",
      productos: carrito.map((p) => ({
        id: p.id,
        name: p.name,
        cantidad: 1,
        price: parseFloat(p.price || 0),
      })),
    };

    try {
      setLoading(true);
      const res = await enviarPedido(pedido);

      const newOrder = {
        id: res?.pedido_id ?? `DEMO-${Date.now()}`, // fallback si no viene id
        fecha: new Date().toISOString(),
        estado: "pendiente",
        total: pedido.total,
        productos: pedido.productos,
      };

      setLastOrder(newOrder);
      setCarrito([]);
      sessionStorage.removeItem("DEMO_FLOW"); // limpiar flag demo
      navigate("/mis-pedidos");
    } catch (err) {
      console.error("❌ Error al enviar pedido (modo demo continúa):", err);

      // Fallback sin bloquear la demo
      const newOrder = {
        id: `DEMO-${Date.now()}`,
        fecha: new Date().toISOString(),
        estado: "pendiente",
        total: pedido.total,
        productos: pedido.productos,
      };

      setLastOrder(newOrder);
      setCarrito([]);
      sessionStorage.removeItem("DEMO_FLOW");
      navigate("/mis-pedidos");
    } finally {
      setLoading(false);
    }
  };

  // Banner inicial en modo demo
  useEffect(() => {
    if (isDemo && carrito.length > 0) {
      setShowGuide(true);
      setGuideSeconds(4);
    }
  }, [isDemo, carrito.length]);

  // Countdown del banner
  useEffect(() => {
    if (!showGuide) return;
    if (guideSeconds <= 0) {
      startShowcase();
      return;
    }
    const t = setTimeout(() => setGuideSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showGuide, guideSeconds]);

  // Recorrido visual y auto-finalización
  const startShowcase = async () => {
    if (hasShowcased) return;
    setHasShowcased(true);
    setShowGuide(false);
    if (carrito.length === 0) return;

    for (let i = 0; i < carrito.length; i++) {
      setHighlightIndex(i);
      await sleep(900);
      setHighlightIndex(null);
      await sleep(250);
    }

    setPulseFinish(true);
    finishBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    await sleep(1200);

    if (isDemo) {
      await finalizarCompra();
      setPulseFinish(false);
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
            {carrito.map((p, idx) => (
              <li
                key={p.id}
                className={`carrito-item ${highlightIndex === idx ? "is-highlight" : ""}`}
              >
                <img src={p.image || "/placeholder.png"} alt={p.name} />
                <div className="carrito-info">
                  <p className="carrito-name">{p.name}</p>
                  <span className="carrito-price">
                    ${parseFloat(p.price || 0).toFixed(2)}
                  </span>
                </div>
                <button className="carrito-remove" onClick={() => eliminar(p.id)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <p>Total: ${total.toFixed(2)}</p>
            <button
              ref={finishBtnRef}
              className={`btn-finalizar ${pulseFinish ? "is-pulsing" : ""}`}
              onClick={finalizarCompra}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Finalizar compra"}
            </button>
          </div>
        </>
      )}

      {showGuide && (
        <GuideBanner
          title="Revisión del carrito"
          text="Ahora resaltaremos cada producto del carrito y, al finalizar, se confirmará la compra automáticamente."
          seconds={guideSeconds}
          onClose={startShowcase}
          actionLabel="Comenzar ahora"
          showCountdown
        />
      )}
    </div>
  );
}
