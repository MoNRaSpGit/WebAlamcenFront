import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Demo.css"; // recuerda: tus CSS viven en src/styles

export default function Demo() {
    const navigate = useNavigate();
    const INITIAL = 2; // ⏱️ segundos de cuenta regresiva
    const [seconds, setSeconds] = useState(INITIAL);

    // porcentaje para barra de progreso
    const pct = useMemo(
        () => Math.round(((INITIAL - seconds) / INITIAL) * 100),
        [seconds]
    );

    // ...
    useEffect(() => {
        if (seconds <= 0) {
            // 📌 Al terminar -> vamos a /productos con flag de demo
            navigate("/productos", { state: { demo: true } });
            return;
        }
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [seconds, navigate]);
    // ...


    return (
        <main className="demo-wrap">
            <section className="demo-card" role="region" aria-labelledby="demo-title">
                <h1 id="demo-title" className="demo-title">
                    Demo automática — WebAlmacén 🏪
                </h1>

                <p className="demo-lead">
                    Hola, buen día. Esta es una <strong>demo 100% automática</strong> del flujo
                    de compra: selección de productos, agregado al carrito y confirmación del
                    pedido, sin intervención del usuario. Ideal para ver el recorrido completo
                    de un e-commerce en <strong>modo presentación</strong>.
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
                        Iniciando en <span className="countdown__num">{seconds}</span> s…
                    </div>
                </div>

                <div className="demo-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/demo/escaneo")}
                    >
                        Iniciar ahora
                    </button>
                </div>
            </section>
        </main>
    );
}
