import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductos } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import GuideBanner from "../components/GuideBanner";
import "../styles/Productos.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Productos({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGuide, setShowGuide] = useState(false);
  const [guideSeconds, setGuideSeconds] = useState(10); // ⏱️ cuenta del cartel
  const [highlightId, setHighlightId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = useMemo(() => location.state?.demo === true, [location.state]);

  /* ======================================================
     ✅ Scroll al producto (para mobile)
     ====================================================== */
  const scrollToProduct = async (id) => {
    const el = document.querySelector(`[data-pid="${id}"]`);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    await sleep(650); // espera a que termine el scroll
  };

  /* ======================================================
     ✅ 1) Cargar productos: primero cache demo, luego back
     ====================================================== */
  useEffect(() => {
    let mounted = true;

    // 1) Intentar leer cache de sessionStorage (prefetch desde Demo.jsx)
    try {
      const cached = sessionStorage.getItem("demo_productos");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductos(parsed);
          setLoading(false);

          // opcional: refrescar en background (sin bloquear UI)
          getProductos()
            .then((fresh) => {
              if (!mounted) return;
              if (Array.isArray(fresh) && fresh.length > 0) {
                setProductos(fresh);
                sessionStorage.setItem("demo_productos", JSON.stringify(fresh));
                sessionStorage.setItem("demo_productos_ts", String(Date.now()));
              }
            })
            .catch(() => {});

          return; // ya mostramos instantáneo
        }
      }
    } catch (e) {
      // si el JSON viene roto, ignoramos cache
    }

    // 2) Si no hay cache válido, ir al back normal
    setLoading(true);
    getProductos()
      .then((data) => {
        if (!mounted) return;
        setProductos(data);
        setLoading(false);

        // guardamos también para próximas pantallas en demo
        if (Array.isArray(data) && data.length > 0) {
          sessionStorage.setItem("demo_productos", JSON.stringify(data));
          sessionStorage.setItem("demo_productos_ts", String(Date.now()));
        }
      })
      .catch((err) => {
        console.error("❌ Error cargando productos:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ======================================================
     ✅ 2) Si venimos de la demo, mostramos el cartel
     ====================================================== */
  useEffect(() => {
    if (isDemo) setShowGuide(true);
  }, [isDemo]);

  /* ======================================================
     ✅ 3) Cuenta regresiva del cartel y arranque automático
     ====================================================== */
  useEffect(() => {
    if (!showGuide) return;

    // Si todavía no hay productos, no descontamos (evita arrancar sin data)
    if (productos.length === 0) return;

    if (guideSeconds <= 0) {
      startSimulation();
      return;
    }

    const t = setTimeout(() => setGuideSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showGuide, guideSeconds, productos.length]);

  // ✅ Usa el setter funcional para evitar "stale state"
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      if (prev.some((p) => p.id === producto.id)) return prev;
      return [...prev, producto];
    });
  };

  // Selección simulada de 3 productos con highlight + scroll (mobile friendly)
  const startSimulation = async () => {
    setShowGuide(false);

    // seguridad
    if (productos.length === 0) return;

    const shuffled = [...productos].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, Math.min(3, shuffled.length));

    for (const prod of picks) {
      await scrollToProduct(prod.id); // ✅ NUEVO: trae el producto a la vista

      setHighlightId(prod.id);
      await sleep(900);
      agregarAlCarrito(prod);
      await sleep(800);
      setHighlightId(null);
      await sleep(250);
    }

    navigate("/carrito?demo=1", { state: { demo: true } });
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">🛒 Nuestros Productos</h2>

      {loading && productos.length === 0 ? (
        <p className="no-products">Cargando productos...</p>
      ) : (
        <div className="productos-grid">
          {productos.map((p) => (
            <div key={p.id} data-pid={p.id}>
              <ProductCard
                producto={p}
                onAgregar={() => agregarAlCarrito(p)}
                highlight={highlightId === p.id}
              />
            </div>
          ))}
        </div>
      )}

      {showGuide && (
        <GuideBanner
          title="Simulación de selección"
          text={
            productos.length === 0
              ? "Cargando productos... "
              : "Ahora vamos a simular la selección de 3 productos. Se agregarán automáticamente al carrito, uno por uno."
          }
          seconds={guideSeconds}
          onClose={startSimulation}
          actionLabel="Comenzar ahora"
          showCountdown={productos.length > 0} // si no hay productos, no mostramos countdown
        />
      )}
    </div>
  );
}
