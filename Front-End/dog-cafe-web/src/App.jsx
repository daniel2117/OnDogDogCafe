import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Booking from "./pages/Cafe/Booking";
import BookingDetail from "./pages/Cafe/BookingDetail";

//Adoption
import Adoption from "./pages/Adoption/Adoption";
import DogDetail from "./pages/Adoption/DogDetail";
import AdoptionApplication from './pages/AdoptionApplication/AdoptionApplication';

//RehomeApplication
// import RehomeStart from './pages/Rehome/RehomeStartPage';
// import PrimaryQuestions from './pages/Rehome/PrimaryQuestions';
// import PetImage from './pages/Rehome/PetImage';
// import Characteristics from './pages/Rehome/Characteristics';
// import KeyFacts from './pages/Rehome/KeyFacts';
// import PetStory from './pages/Rehome/PetStory';
// import Documents from './pages/Rehome/Documents';
// import Confirm from './pages/Rehome/Confirm';



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
        <Route path="/contactus" element={<ContactUs lang={lang} toggleLang={toggleLang} />} />
        {/* Cafe */}
        <Route path="/booking" element={<Booking lang={lang} toggleLang={toggleLang} />} />
        <Route path="/bookingDetail" element={<BookingDetail lang={lang} toggleLang={toggleLang} />} />
        {/* Adoption */}
        <Route path="/adoption" element={<Adoption lang={lang} toggleLang={toggleLang} />} />
        <Route path="/dog/:id" element={<DogDetail lang={lang} toggleLang={toggleLang} />} />
        {/* Adoption Application */}
        <Route path="/adoption/apply" element={<AdoptionApplication />} />
        {/* Rehome Application */}
        {/* 
        <Route path="/rehome/start" element={<RehomeStart />} />
        <Route path="/rehome/primary" element={<PrimaryQuestions />} />
        <Route path="/rehome/images" element={<PetImage />} />
        <Route path="/rehome/characteristics" element={<Characteristics />} />
        <Route path="/rehome/keyfacts" element={<KeyFacts />} />
        <Route path="/rehome/story" element={<PetStory />} />
        <Route path="/rehome/documents" element={<Documents />} />
        <Route path="/rehome/confirm" element={<Confirm />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
