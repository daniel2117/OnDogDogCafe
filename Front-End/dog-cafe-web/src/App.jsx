import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";

//Reservation
import Booking from "./pages/Cafe/Booking";
import BookingDetail from "./pages/Cafe/BookingDetail";

//Adoption
import Adoption from "./pages/Adoption/Adoption";
import DogDetail from "./pages/Adoption/DogDetail";
import AdoptionApplication from './pages/AdoptionApplication/AdoptionApplication';

//RehomeApplication
import RehomeApplication from "./pages/RehomeApplication/RehomeApplication";

//MyPage
import MyPage from "./pages/MyPage/MyPage";
import MyPageHome from "./pages/MyPage/MyPageHome";
import AdoptionApplicationView from "./components/AdoptionApplicationView";
import RehomingApplicationView from "./components/RehomingApplicationView";

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
        <Route path="/adoption/apply" element={<AdoptionApplication lang={lang} toggleLang={toggleLang} />} />
        {/* Rehome Application */}
        <Route path="/rehome/apply" element={<RehomeApplication lang={lang} toggleLang={toggleLang} />} />
        {/* MyPage */}
        <Route path="/mypage" element={<MyPage lang={lang} toggleLang={toggleLang} />} />
        <Route path="/mypage/home" element={<MyPageHome lang={lang} toggleLang={toggleLang} />} />
        <Route path="/adoption-application-view" element={<AdoptionApplicationView lang={lang} toggleLang={toggleLang} />} />
        <Route path="/rehoming-application-view" element={<RehomingApplicationView lang={lang} toggleLang={toggleLang} />} />
      </Routes>
    </Router>
  );
}

export default App;
