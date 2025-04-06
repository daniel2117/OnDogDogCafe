import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Booking from "./pages/Booking";
import BookingDetail from "./pages/BookingDetail";

//Adoption
import Adoption from "./pages/Adoption";
import DogDetail from "./pages/DogDetail";

//Rehome
import RehomeStart from './pages/rehome/RehomeStartPage';
import PrimaryQuestions from './pages/rehome/PrimaryQuestions';
import PetImage from './pages/rehome/PetImage';
import Characteristics from './pages/rehome/Characteristics';
import KeyFacts from './pages/rehome/KeyFacts';
import PetStory from './pages/rehome/PetStory';
import Documents from './pages/rehome/Documents';
import Confirm from './pages/rehome/Confirm';

function App() {
  const [lang, setLang] = useState("en"); // "en" or "zh"

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "zh" : "en"));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home lang={lang} toggleLang={toggleLang} />} />
        <Route path="/home" element={<Home lang={lang} toggleLang={toggleLang} />} />
        <Route path="/booking" element={<Booking lang={lang} toggleLang={toggleLang} />} />
        <Route path="/bookingDetail" element={<BookingDetail lang={lang} toggleLang={toggleLang} />} />
        <Route path="/adoption" element={<Adoption lang={lang} toggleLang={toggleLang} />} />
        <Route path="/dog/:id" element={<DogDetail lang={lang} toggleLang={toggleLang} />} />

        {/* Rehome 플로우 */}
        <Route path="/rehome/start" element={<RehomeStart />} />
        <Route path="/rehome/primary" element={<PrimaryQuestions />} />
        <Route path="/rehome/images" element={<PetImage />} />
        <Route path="/rehome/characteristics" element={<Characteristics />} />
        <Route path="/rehome/keyfacts" element={<KeyFacts />} />
        <Route path="/rehome/story" element={<PetStory />} />
        <Route path="/rehome/documents" element={<Documents />} />
        <Route path="/rehome/confirm" element={<Confirm />} />
      </Routes>
    </Router>
  );
}

export default App;
