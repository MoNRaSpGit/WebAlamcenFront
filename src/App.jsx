import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import "./styles/global.css";

function App() {
  const [carrito, setCarrito] = useState([]);

  return (
    <Router basename="/WebAlamcenFront">
      <Navbar cartCount={carrito.length} />

      <Routes>
        <Route
          path="/"
          element={<Productos carrito={carrito} setCarrito={setCarrito} />}
        />
        <Route
          path="/carrito"
          element={<Carrito carrito={carrito} setCarrito={setCarrito} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
