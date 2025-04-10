import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";
import Adoption from "./pages/Adoption";
import DogDetail from "./pages/DogDetail";

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
        <Route path="/bookingDetail" element={<BookingDetail lang={lang} />} />
        <Route path="/adoption" element={<Adoption lang={lang} />} />
        <Route path="/dog/:id" element={<DogDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
