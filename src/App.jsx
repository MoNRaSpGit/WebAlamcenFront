import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Productos />} />
      </Routes>
    </Router>
  );
}

export default App;
