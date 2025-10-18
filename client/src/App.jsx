import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Form from "./components/Form/Form";

function App() {
  return (
    <>
      <Navbar />
      <Form />
    </>
  );
}

export default App;
