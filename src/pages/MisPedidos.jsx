// src/pages/MisPedidos.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuideBanner from "../components/GuideBanner";
import "../styles/MisPedidos.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function MisPedidos({ lastOrder }) {
  const navigate = useNavigate();

  const [showGuide, setShowGuide] = useState(true);
  const [guideSeconds, setGuideSeconds] = useState(4);

  const [showNext, setShowNext] = useState(false);
  const [nextSeconds, setNextSeconds] = useState(4);

  const [highlightBox, setHighlightBox] = useState(false);
  const [highlightStatus, setHighlightStatus] = useState(false);

  useEffect(() => {
    if (!showGuide) return;
    if (guideSeconds <= 0) {
      showcase();
      return;
    }
    const t = setTimeout(() => setGuideSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showGuide, guideSeconds]);

  useEffect(() => {
    if (!showNext) return;
    if (nextSeconds <= 0) {
      navigate("/operador", { replace: true, state: { playVideo: true } });
      return;
    }
    const t = setTimeout(() => setNextSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showNext, nextSeconds, navigate]);

  const showcase = async () => {
    setShowGuide(false);
    if (!lastOrder) return;

    setHighlightBox(true);
    await sleep(1200);
    setHighlightBox(false);
    await sleep(250);

    setHighlightStatus(true);
    await sleep(1200);
    setHighlightStatus(false);

    setShowNext(true);
    setNextSeconds(4);
  };

  return (
    <div className="mp-wrap">
      <h2 className="mp-title">📦 Mis Pedidos</h2>

      {!lastOrder ? (
        <p className="mp-empty">No hay pedidos generados en esta sesión.</p>
      ) : (
        <div className={`mp-card ${highlightBox ? "is-highlight" : ""}`}>
          <div className="mp-head">
            <h3 className="mp-id">Pedido #{lastOrder.id}</h3>
            <span className={`mp-badge ${lastOrder.estado} ${highlightStatus ? "is-pulse" : ""}`}>
              {lastOrder.estado}
            </span>
          </div>

          <ul className="mp-items">
            {lastOrder.productos.map((it, i) => (
              <li key={`${it.id}-${i}`}>
                <span className="mp-item-name">{it.name ?? `Producto #${it.id}`}</span>
                <span className="mp-item-meta">
                  x{it.cantidad} — ${parseFloat(it.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mp-meta">
            <span><strong>Fecha:</strong> {new Date(lastOrder.fecha).toLocaleString()}</span>
            <span><strong>Total:</strong> ${parseFloat(lastOrder.total).toFixed(2)}</span>
          </div>

          <p className="mp-note">
            Ahora te mostraremos la sesión del operador en un video de demostración.
          </p>
        </div>
      )}

      {showGuide && (
        <GuideBanner
          title="Mis Pedidos"
          text="Aquí podés ver tu pedido y su estado actual. Vamos a resaltarlo y continuar."
          seconds={guideSeconds}
          onClose={showcase}
          actionLabel="Comenzar"
          showCountdown
        />
      )}

      {showNext && (
        <GuideBanner
          title="Próxima etapa"
          text="Te llevaremos a la sesión del operador para ver el video demostrativo."
          seconds={nextSeconds}
          onClose={() => navigate("/operador", { replace: true, state: { playVideo: true } })}
          actionLabel="Ir al video del operador"
          showCountdown
        />
      )}
    </div>
  );
}
