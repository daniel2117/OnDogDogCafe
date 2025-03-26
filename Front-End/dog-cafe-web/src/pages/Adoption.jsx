import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Adoption = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const lang = queryParams.get("lang") || "en";

    const texts = {
        en: {
            filter: "Filters",
            reset: "Reset Filters",
            apply: "Apply your Filter",
            moreInfo: "More Info",
            gender: "Gender",
            breed: "Breed",
            age: "Age",
            size: "Size",
            color: "Color",
            bookNow: "Book for Adoption",
            footer: "1F, 3 Soares Avenue, Hong Kong\nTel: 6613 2128\n©2025 by On Dog Dog Cafe."
        },
        zh: {
            filter: "篩選",
            reset: "重設篩選",
            apply: "套用篩選條件",
            moreInfo: "查看詳情",
            gender: "性別",
            breed: "品種",
            age: "年齡",
            size: "體型",
            color: "顏色",
            bookNow: "預約領養狗狗",
            footer: "香港蘇沙道3號1樓\n電話: 6613 2128\n©2025 On Dog Dog Cafe."
        },
    };

    const t = texts[lang];

    const allDogs = Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: `Doggo ${i + 1}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        breed: ["Shiba", "Retriever", "Poodle"][i % 3],
        age: `${1 + (i % 10)} years`,
        size: ["Small", "Medium", "Large"][i % 3],
        img: "/images/pug.png",
        desc: "This is a friendly, playful, smart dog looking for a home."
    }));

    const [page, setPage] = useState(1);
    const dogsPerPage = 9;
    const start = (page - 1) * dogsPerPage;
    const currentDogs = allDogs.slice(start, start + dogsPerPage);
    const totalPages = Math.ceil(allDogs.length / dogsPerPage);

    return (
        <div className="min-h-screen bg-white px-6 py-4 text-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                    <img src="/logo.png" alt="logo" className="h-16" />
                </div>
                <button
                    onClick={() => navigate(`/contactus?lang=${lang}`)}
                    className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-100"
                >
                    Contact Us
                </button>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{t.filter}</h2>
                <div className="flex gap-2">
                    <select className="border px-3 py-1 rounded">
                        <option>{t.breed}</option>
                    </select>
                    <select className="border px-3 py-1 rounded">
                        <option>{t.color}</option>
                    </select>
                    <select className="border px-3 py-1 rounded">
                        <option>{t.gender}</option>
                    </select>
                    <select className="border px-3 py-1 rounded">
                        <option>{t.age}</option>
                    </select>
                    <select className="border px-3 py-1 rounded">
                        <option>{t.size}</option>
                    </select>
                    <button className="ml-2 border px-3 py-1 rounded bg-purple-500 text-white">{t.apply}</button>
                </div>
            </div>

            {/* Dog Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentDogs.map((dog) => (
                    <div key={dog.id} className="border rounded-lg p-4 shadow hover:shadow-md">
                        <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover rounded mb-4" />
                        <div className="mb-2 text-lg font-bold">{dog.name}</div>
                        <div className="text-sm mb-1">Gender: {dog.gender}</div>
                        <div className="text-sm mb-1">Breed: {dog.breed}</div>
                        <div className="text-sm mb-1">Age: {dog.age}</div>
                        <div className="text-sm mb-1">Size: {dog.size}</div>
                        <p className="text-sm text-gray-500 mb-2">{dog.desc}</p>
                        <button
                            className="w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-sm hover:bg-purple-50"
                            onClick={() => navigate(`/dog/${dog.id}?lang=${lang}`)}
                        >
                            {t.moreInfo}
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-30"
                >
                    Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-purple-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-30"
                >
                    Next
                </button>
            </div>

            {/* Book Now Button */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => navigate(`/booking?lang=${lang}`)}
                    className="w-full max-w-md bg-purple-500 text-white px-6 py-3 rounded text-lg hover:bg-purple-600"
                >
                    {t.bookNow}
                </button>
            </div>

            {/* Footer Info */}
            <div className="text-center text-sm text-gray-500 mt-6 whitespace-pre-line">
                {t.footer}
            </div>
        </div>
    );
};

export default Adoption;