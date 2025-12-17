import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Demo.css"; // CSS en src/styles

export default function Demo() {
  const navigate = useNavigate();

  const INITIAL = 20; // ⏱️ segundos de cuenta regresiva
  const [seconds, setSeconds] = useState(INITIAL);

  // porcentaje para barra de progreso
  const pct = useMemo(
    () => Math.round(((INITIAL - seconds) / INITIAL) * 100),
    [seconds]
  );

  /* ======================================================
     🚀 PREFETCH DE PRODUCTOS (apenas entra a la demo)
     ====================================================== */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        // evita pedir de nuevo si ya están cacheados
        const cached = sessionStorage.getItem("demo_productos");
        if (cached) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/productos`,
          { signal: controller.signal }
        );

        if (!res.ok) return;

        const data = await res.json();

        sessionStorage.setItem("demo_productos", JSON.stringify(data));
        sessionStorage.setItem("demo_productos_ts", String(Date.now()));
      } catch (err) {
        // Render puede estar dormido → no rompemos la demo
        console.warn("Prefetch productos falló (demo):", err);
      }
    })();

    return () => controller.abort();
  }, []);

  /* ======================================================
     ⏱️ Cuenta regresiva automática
     ====================================================== */
  useEffect(() => {
    if (seconds <= 0) {
      navigate("/productos", { state: { demo: true } });
      return;
    }

    const t = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [seconds, navigate]);

  // ▶️ Arranque manual inmediato
  const startNow = () => {
    navigate("/productos", { state: { demo: true } });
  };

  return (
    <main className="demo-wrap">
      <section
        className="demo-card"
        role="region"
        aria-labelledby="demo-title"
      >
        <h1 id="demo-title" className="demo-title">
          Demo automática — WebAlmacén 🏪
        </h1>

        <p className="demo-lead">
          Hola, buen día. Esta es una <strong>demo 100% automática</strong> del
          flujo de compra: selección de productos, agregado al carrito y
          confirmación del pedido, sin intervención del usuario. Ideal para ver
          el recorrido completo de un e-commerce en{" "}
          <strong>modo presentación</strong>.
        </p>

        <ul className="demo-list">
          <li>🛍️ Selección simulada de productos</li>
          <li>🧺 Carrito actualizado automáticamente</li>
          <li>🧾 Confirmación y guardado del pedido</li>
          <li>🖨️ Vista de ticket de impresión (simulada)</li>
        </ul>

        <div className="demo-progress" aria-live="polite">
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>

          <div className="countdown">
            Iniciando en{" "}
            <span className="countdown__num">{seconds}</span> s…
          </div>
        </div>

        <div className="demo-actions">
          <button
            type="button" // ⛔ evita submit / reload
            className="btn btn-primary"
            onClick={startNow}
          >
            Iniciar ahora
          </button>
        </div>
      </section>
    </main>
  );
}
