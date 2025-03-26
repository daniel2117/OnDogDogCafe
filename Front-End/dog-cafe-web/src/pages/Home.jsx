import { Link } from "react-router-dom";

const Home = ({ lang, toggleLang }) => {
    const texts = {
        en: {
            title: "Reservation",
            book: "Book for the cafe",
            message: "A few words from us",
            hours: `Cafe Opening Hours:
Monday: Closed
Tuesday–Sunday: 1–7 pm`,
            powered: "powered by Sangchul",
            language: "中文",
        },
        zh: {
            title: "預約",
            book: "預約狗狗咖啡廳",
            message: "來自我們的話",
            hours: `營業時間：
星期一：休息
星期二至星期日：下午1點至7點`,
            powered: "由 Sangchul 提供",
            language: "English",
        },
    };

    const t = texts[lang];

    return (
        <div className="min-h-screen bg-[#f4ebe4] flex flex-col items-center px-4 py-6 text-[#333] font-sans">
            {/* Header */}
            <div className="w-full flex justify-between items-center max-w-4xl mb-4">
                <img src="/logo.png" alt="Dog Dog Cafe" className="h-14" />
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {t.language}
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6">{t.title}</h1>

            {/* Reservation Cards */}
            <div className="flex flex-col gap-6 max-w-md w-full">
                {[1, 2].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl overflow-hidden shadow-md"
                    >
                        <img
                            src={`/images/cafe${i + 1}.jpg`}
                            alt={`Cafe Reservation ${i + 1}`}
                            className="w-full h-48 object-cover"
                        />
                        <Link
                            to="/booking"
                            className="block text-center font-semibold py-3 hover:underline"
                        >
                            {t.book}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <h2 className="text-xl font-semibold mb-2">{t.message}</h2>
                <pre className="text-sm leading-relaxed whitespace-pre-wrap">
                    {t.hours}
                </pre>
            </div>

            <footer className="mt-10 text-xs text-gray-500">{t.powered}</footer>
        </div>
    );
};

export default Home;
