// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Demo from "./pages/Demo";
import MisPedidos from "./pages/MisPedidos";
import "./styles/global.css";
import Operador from "./pages/Operador"; // 👈 nuevo import

function App() {
  const [carrito, setCarrito] = useState([]);
  const [lastOrder, setLastOrder] = useState(null); // 👈 pedido en memoria (no persiste)

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Navbar cartCount={carrito.length} />
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route
          path="/productos"
          element={<Productos carrito={carrito} setCarrito={setCarrito} />}
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              setCarrito={setCarrito}
              lastOrder={lastOrder}
              setLastOrder={setLastOrder}   // 👈 pasamos setter al carrito
            />
          }
        />
        <Route
          path="/mis-pedidos"
          element={
            <MisPedidos
              lastOrder={lastOrder}
              setLastOrder={setLastOrder}   // 👈 para cambiar estado en UI
            />
          }
        />
        <Route path="/operador" element={<Operador lastOrder={lastOrder} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
