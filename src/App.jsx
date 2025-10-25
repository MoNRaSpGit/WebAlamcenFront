import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";

function App() {
  return (
    <Router basename="/WebAlamcenFront"> {/* 👈 importante en GitHub Pages */}
      <Routes>
        <Route path="/" element={<Productos />} />
      </Routes>
    </Router>
  );
}

export default App;
