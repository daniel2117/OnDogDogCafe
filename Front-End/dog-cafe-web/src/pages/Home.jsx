import { useNavigate } from "react-router-dom";

const Home = ({ lang, toggleLang }) => {
    const navigate = useNavigate();

    const texts = {
        en: {
            explore: "Explore Now",
            // cafe: "Cafe",
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
            footer: "1F, 3 Soares Avenue\nTel: 6613 2128\n©2025 by On Dog Dog Cafe."
        },
        zh: {
            explore: "立即探索",
            // cafe: "咖啡廳",
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
            footer: "香港蘇沙道3號1樓\n電話: 6613 2128\n©2025 On Dog Dog Cafe."
        },
    };

    const t = texts[lang];

    return (
        <div className="min-h-screen font-sans bg-white text-gray-800">
            <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                <img src="/logo.png" alt="logo" className="h-16" />
            </div>
            {/* Hero Section */}
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
                                {t.explore}
                            </button>
                            {/* <button
                                onClick={() => navigate(`/booking?lang=${lang}`)}
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
                    <div className="border rounded p-4 shadow">
                        <img src="/images/cafe1.png" className="rounded mb-2" alt="Cafe" />
                        <h3 className="font-semibold">Pet Cafe</h3>
                        <p className="text-sm text-gray-600">A cozy haven where animal lovers can unwind and enjoy the company of adorable furry friends.</p>
                    </div>
                    <div className="border rounded p-4 shadow">
                        <img src="/images/cafe2.png" className="rounded mb-2" alt="Swimming" />
                        <h3 className="font-semibold">Dog Swimming Pool</h3>
                        <p className="text-sm text-gray-600">A safe and climate-controlled environment where your furry friends can enjoy swimming year-round.</p>
                    </div>
                    <div className="border rounded p-4 shadow">
                        <img src="/images/cafe2.png" className="rounded mb-2" alt="Day Care" />
                        <h3 className="font-semibold">Day Care Service</h3>
                        <p className="text-sm text-gray-600">A safe and stimulating environment for your furry companions to socialize and play while you're away.</p>
                    </div>
                </div>
            </div>

            {/* Pet Preview Section */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t.somePets}</h2>
                    <button onClick={() => navigate(`/adoption?lang=${lang}`)} className="text-sm text-blue-600 hover:underline">
                        {t.viewMore}
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border p-2 rounded text-center shadow">
                            <img src="/images/1.jpeg" alt="dog" className="rounded mb-2 w-full h-32 object-cover" />
                            <div className="font-semibold text-sm">MO50{i + 1} - Corgi</div>
                            <div className="text-xs text-gray-600">Male · 02 months</div>
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
                            Map
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
        </div>
    );
};

export default Home;
