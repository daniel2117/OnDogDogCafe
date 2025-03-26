import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Adoption from "./pages/Adoption";

function App() {
  const [lang, setLang] = useState("en"); // "en" or "zh"

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "zh" : "en"));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home lang={lang} toggleLang={toggleLang} />} />
        <Route path="/booking" element={<Booking lang={lang} />} />
        <Route path="/adoption" element={<Adoption lang={lang} />} />
      </Routes>
    </Router>
  );
}

export default App;
