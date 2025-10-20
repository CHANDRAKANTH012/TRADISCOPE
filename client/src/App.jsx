import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import News from "./pages/News";
import Plan from "./pages/Plan";
import Bias from "./pages/Bias";
import Calculator from "./pages/Calculator";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/bias" element={<Bias />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
