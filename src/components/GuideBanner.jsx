import "../styles/GuideBanner.css";

export default function GuideBanner({
  title,
  text,
  actionLabel = "Continuar",
  onClose,
  seconds,            // 👈 nuevo: mostramos cuenta
  showCountdown = true
}) {
  return (
    <div className="guide-overlay" role="dialog" aria-modal="true">
      <div className="guide-card">
        <h3 className="guide-title">{title}</h3>
        <p className="guide-text">{text}</p>

        {showCountdown && typeof seconds === "number" && (
          <div className="guide-countdown">
            Empezamos en <span className="guide-countdown__num">{seconds}</span> s…
          </div>
        )}

        <div className="guide-actions">
          <button className="guide-btn" onClick={onClose}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
