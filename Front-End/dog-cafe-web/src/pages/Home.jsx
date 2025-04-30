import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adoptionApi, feedbackApi } from "../services/api";
import GoogleMapComponent from '../components/GoogleMapComponent';
import FeedbackSection from "../components/FeedbackSection";


const Home = ({ lang, toggleLang }) => {
    const navigate = useNavigate();
    const [dogs, setDogs] = useState([]);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const response = await adoptionApi.getDogs({ page: 1, limit: 8 });
                setDogs(response.dogs || []);
            } catch (err) {
                console.error("Failed to fetch dogs", err);
            }
        };
        fetchDogs();
    }, []);


    const texts = {
        en: {
            myPage: "My Page",
            contactUs: "Contact Us",
            explore: "Explore Now",
            cafe: "Make a reservation",
            adoption: "Adoption",
            heroTitle: "One More Friend",
            heroSubtitle: "Thousands More Fun!",
            heroDesc:
                "Having a pet means you have more joy, a new friend, a happy person who will always be with you to have fun. We have 200+ different pets that can meet your needs!",
            ourCafe: "Our Cafe",
            somePets: "Take A Look At Some Of Our Pets",
            viewMore: "View more →",
            location: "Location",
            bookNow: "Book Now",
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe.",
            cafeServices: [
                {
                    title: "Pet Cafe",
                    desc: "A cozy haven where animal lovers can unwind and enjoy the company of adorable furry friends.\nAdmission: $170/person (unlimited time). Includes 1 drink voucher. Outside food and delivery allowed."
                },
                {
                    title: "Dog Swimming Pool",
                    desc: "A safe and climate-controlled environment where your furry friends can enjoy swimming year-round.\n30-min sessions from 10am–6pm daily. Fees: $450–$950 by dog size. Max 2 dogs/session. $1,000 cleaning fee if accidents occur."
                },
                {
                    title: "Day Care Service",
                    desc: "A safe and stimulating environment for your furry companions to socialize and play while you're away.\nAvailable weekends/holidays only. Fees: $750–$1,000/hr. Min. 2-hour booking, 2 weeks advance reservation required."
                }
            ]

        },
        zh: {
            myPage: "我的頁面",
            contactUs: "聯繫我們",
            explore: "立即探索",
            cafe: "預訂一下",
            adoption: "領養狗狗",
            heroTitle: "多一位朋友",
            heroSubtitle: "多千倍歡樂！",
            heroDesc:
                "擁有寵物代表更多歡樂與陪伴，200+ 不同種類的毛孩總有一位適合你！",
            ourCafe: "我們的咖啡廳",
            somePets: "看看我們的寵物",
            viewMore: "查看更多 →",
            location: "地點",
            bookNow: "立即預約",
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 On Dog Dog Cafe.",
            cafeServices: [
                {
                    title: "寵物咖啡廳",
                    desc: "一個讓愛動物的人可以放鬆並享受毛孩陪伴的溫馨天地。\n入場費：每人 $170（不限時）。包含 1 張飲品券，允許攜帶外食或叫外賣。"
                },
                {
                    title: "狗狗游泳池",
                    desc: "安全並全年恆溫的游泳空間，讓毛孩盡情享受戲水樂趣。\n每日 10am–6pm 開放，每節 30 分鐘。收費依體型 $450–$950。每節最多 2 隻狗，若超過 20kg 則限 1 隻。若有意外，清潔費 $1,000。"
                },
                {
                    title: "日間托管服務",
                    desc: "提供安全又充滿刺激的環境，讓毛孩在你外出時也能玩得開心。\n僅限週末及公眾假期。收費每小時 $750–$1,000。最少預約 2 小時，需提前 2 週預訂。"
                }
            ]


        },
    };

    const t = texts[lang];

    return (
        <div className="min-h-screen font-sans bg-white text-gray-800">
            {/* Header Section */}
            <div className="flex justify-between items-center px-6 py-4">
                <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                    <img src="/logo.png" alt="logo" className="h-16" />
                </div>

                {/* Right-aligned buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/mypage?lang=${lang}`)}
                        className="border px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {t.myPage}
                    </button>
                    <button
                        onClick={() => navigate(`/contactus?lang=${lang}`)}
                        className="border px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {t.contactUs}
                    </button>
                </div>
            </div>

            <div className="relative bg-[#fff7ed] px-6 pt-10 pb-16 overflow-hidden">

                {/* Language toggle */}
                <div className="absolute top-4 right-6">
                    <button
                        onClick={toggleLang}
                        className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                    >
                        {lang === "en" ? "中文" : "English"}
                    </button>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
                    {/* Text */}
                    <div className="max-w-xl mb-10 lg:mb-0">
                        <h1 className="text-4xl font-extrabold leading-tight text-[#1d3557] mb-1">
                            {t.heroTitle}
                        </h1>
                        <h2 className="text-3xl font-bold text-[#1d3557] mb-4">
                            {t.heroSubtitle}
                        </h2>
                        <p className="text-gray-600 mb-6 whitespace-pre-line">{t.heroDesc}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(`/booking?lang=${lang}`)}
                                className="bg-[#457b9d] text-white px-6 py-2 rounded hover:bg-[#35607b]"
                            >
                                {t.cafe}
                            </button>
                            {/* <button
                                onClick={() => navigate(`/bookingDetail?lang=${lang}`)}
                                className="border border-[#457b9d] text-[#457b9d] px-6 py-2 rounded hover:bg-[#f1faee]"
                            >
                                {t.cafe}
                            </button> */}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                        <img
                            src="/images/home.webp"
                            alt="Hero Dog Hug"
                            className="w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Our Cafe Section */}
            <div className="max-w-7xl mx-auto py-12 px-6">
                <h2 className="text-2xl font-bold mb-6">{t.ourCafe}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {t.cafeServices.map((service, idx) => (
                        <div key={idx} className="border rounded p-4 shadow">
                            <img src={`/images/cafe${idx + 1}.png`} className="rounded mb-2" alt={service.title} />
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-gray-600">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Pet Preview Section */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t.somePets}</h2>
                    <button
                        onClick={() => navigate(`/adoption?lang=${lang}`)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {t.viewMore}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dogs.map((dog) => (
                        <div
                            key={dog._id}
                            onClick={() => navigate(`/dog/${dog._id}?lang=${lang}`)}
                            className="border p-2 rounded text-center shadow cursor-pointer hover:shadow-md transition"
                        >
                            <img
                                src={dog.imageUrl || "/images/default-dog.png"}
                                alt={dog.name}
                                className="rounded mb-2 w-full h-32 object-cover"
                            />
                            <div className="font-semibold text-sm">
                                {dog.name} - {dog.breed}
                            </div>
                            <div className="text-xs text-gray-600">
                                {dog.gender} · {dog.age} years
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            {/* Location Section */}
            <div className="bg-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">{t.location}</h2>
                        <div className="bg-white h-64 flex items-center justify-center text-lg font-semibold text-gray-400 border">
                            <GoogleMapComponent t={t} />
                        </div>
                    </div>
                    <div className="text-sm text-gray-700">
                        <h3 className="font-semibold text-lg mb-2">On Dog Dog Cafe</h3>
                        <p>Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D</p>
                        <p className="mt-4">
                            <strong>Opening Hours:</strong><br />
                            Mon: Closed<br />
                            Tue–Sun: 1–7pm<br />
                            Public Holidays: Closed
                        </p>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <FeedbackSection lang={lang} />


            {/* Footer */}
            <footer className="text-center text-sm text-gray-600 py-8">
                <button
                    onClick={() => navigate(`/booking?lang=${lang}`)}
                    className="mb-4 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    {t.bookNow}
                </button>
                <div className="whitespace-pre-line">
                    {t.footer}
                </div>
            </footer>
        </div >
    );
};

export default Home;
