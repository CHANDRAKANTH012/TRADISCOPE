import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import News from "./pages/News";
import Plan from "./pages/Plan";
import Bias from "./pages/Bias";
import Calculator from "./pages/Calculator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AiAssistant from "./components/AiAssistant/AiAssistant";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white">
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <News />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <Plan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bias"
            element={
              <ProtectedRoute>
                <Bias />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      {/* Global floating AI assistant — only shows when authenticated */}
      <AiAssistant />
    </div>
  );
}

export default App;
