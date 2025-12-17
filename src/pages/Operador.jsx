// src/pages/Operador.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Operador.css";

export default function Operador({ lastOrder }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Flag que viene desde MisPedidos para arrancar directo al video
  const playVideoFromNav = location.state?.playVideo === true;

  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // overlay si autoplay con audio fue bloqueado

  const DEFAULT_RATE = 1.5; // ✅ velocidad por defecto

  // Si no hay pedido, redirigimos (mantiene coherencia del flujo)
  useEffect(() => {
    if (!lastOrder) {
      navigate("/productos", { replace: true });
      return;
    }
  }, [lastOrder, navigate]);

  // Al montar: mostrar video y tratar de reproducir con audio
  useEffect(() => {
    // Si venimos desde MisPedidos con la intención de ver el video
    if (playVideoFromNav) {
      setShowVideo(true);

      // Intentar autoplay con audio
      const tryAutoplayWithSound = async () => {
        const v = videoRef.current;
        if (!v) return;

        // ✅ setear velocidad antes de reproducir
        v.playbackRate = DEFAULT_RATE;

        v.muted = false; // queremos audio
        try {
          await v.play(); // muchos navegadores bloquearán esto sin gesto del usuario
          setShowOverlay(false);
        } catch (err) {
          // Si falla, mostramos overlay para que el usuario toque y se habilite el audio
          setShowOverlay(true);
          try {
            // fallback: comenzar en silencio para que aparezca el frame del video
            v.muted = true;

            // ✅ asegurar velocidad también en el fallback
            v.playbackRate = DEFAULT_RATE;

            await v.play();
          } catch {
            // si también falla, esperamos al toque del usuario
          }
        }
      };

      tryAutoplayWithSound();

      // Limpiar el state de navegación para no re-disparar al volver
      if (location.state?.playVideo) {
        navigate(".", { replace: true, state: {} });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lastOrder) return null; // evita parpadeo si redirige

  const handlePlayWithSound = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;

      // ✅ asegurar velocidad cuando el usuario toca el botón
      v.playbackRate = DEFAULT_RATE;

      await v.play(); // ahora hay gesto del usuario → debe permitir audio
      setShowOverlay(false);
    } catch (e) {
      console.error("No se pudo reproducir con sonido:", e);
    }
  };

  // ✅ extra: al cargar metadata, re-aplicamos la velocidad por si el navegador la resetea
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = DEFAULT_RATE;
  };

  return (
    <div className="op-wrap">
      <h2 className="op-title">🧑‍💼 Sesión del Operador (Demo)</h2>

      {/* SOLO VIDEO */}
      <section className="op-video" aria-live="polite">
        {showVideo && (
          <div className="op-video-box">
            <video
              ref={videoRef}
              className="op-video-player"
              src={`${import.meta.env.BASE_URL}Video1.mp4`} // ¡ojo la V mayúscula!
              controls
              autoPlay
              playsInline
              preload="metadata"
              onLoadedMetadata={handleLoadedMetadata} // ✅ garantiza 1.5x al cargar
              onError={(e) => console.error("❌ No se pudo cargar /Video1.mp4", e)}
            />

            {/* Overlay si el navegador bloqueó autoplay con sonido */}
            {showOverlay && (
              <div
                className="op-video-overlay"
                role="dialog"
                aria-label="Reproducir con sonido"
              >
                <button className="op-video-playbtn" onClick={handlePlayWithSound}>
                  🔊 Reproducir con sonido
                </button>
                <p className="op-video-hint">Tocá/clic para habilitar el audio.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
