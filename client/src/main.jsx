import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TradeContextProvider } from "./context/TradeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TradeContextProvider>
          <App />
        </TradeContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
