
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { adoptionApi } from "../../services/api";


const DogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(useLocation().search);
    const lang = queryParams.get("lang") || "en";


    const [dog, setDog] = useState(null);
    const [similarPets, setSimilarPets] = useState([]);

    useEffect(() => {
        const fetchDog = async () => {
            try {
                const response = await adoptionApi.getDogDetails(id);
                setDog(response);
            } catch (error) {
                console.error("Error fetching dog detail:", error);
            }
        };

        const fetchSimilar = async () => {
            try {
                const response = await adoptionApi.getSimilarDogs(id);
                setSimilarPets(response);
            } catch (error) {
                console.error("Error fetching similar dogs:", error);
            }
        };

        fetchDog();
        fetchSimilar();
    }, [id]);

    const texts = {
        en: {
            gender: "Gender",
            breed: "Breed",
            age: "Age",
            color: "Color",
            weight: "Weight",
            height: "Height",
            vaccinated: "Vaccinated",
            interested: "If you are interested to adopt",
            getStarted: "Get started",
            similar: "Similar Pets",
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe."

        },
        zh: {
            gender: "性別",
            breed: "品種",
            age: "年齡",
            color: "顏色",
            weight: "體重",
            height: "身高",
            vaccinated: "疫苗記錄",
            interested: "若您有興趣領養",
            getStarted: "開始預約",
            similar: "類似狗狗",

            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe."

        },
    };

    const t = texts[lang];


    if (!dog) return <div className="p-6 text-center">Loading...</div>;


    return (
        <div className="px-6 py-6 text-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <img src="/logo.png" alt="logo" className="h-16 cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)} />
                <button
                    onClick={() => navigate(`/contactus?lang=${lang}`)}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                    Contact Us
                </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6">

                <img src={dog.imageUrl || "/images/pug.png"} alt="dog profile" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <div className="text-xl font-bold">{dog.name}</div>

                </div>
            </div>

            {/* Main Image */}

            <img src={dog.imageUrl || "/images/pug.png"} alt="main" className="w-full max-h-[400px] object-cover rounded mb-4" />

            {/* Description + Health Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-100 p-4 rounded">
                    <div className="font-semibold mb-2">{dog.name} Story</div>
                    <p className="text-sm whitespace-pre-line">{dog.description}</p>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    {(dog.healthRecords ?? []).map((record, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span>✔️</span>
                            <span>{record.description}</span>

                        </div>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs text-center text-purple-700 mb-6">
                <div className="border rounded p-2">{t.gender}: {dog.gender}</div>
                <div className="border rounded p-2">{t.breed}: {dog.breed}</div>
                <div className="border rounded p-2">{t.age}: {dog.age}</div>

                <div className="border rounded p-2">{t.color}: {dog.color || '-'}</div>
                <div className="border rounded p-2">{t.weight}: {dog.weight || '-'}</div>
                <div className="border rounded p-2">{t.height}: {dog.height || '-'}</div>

            </div>

            {/* Adopt Button */}
            <div className="text-center mb-10">
                <div className="mb-2 font-semibold">{t.interested}</div>
                <button

                    onClick={() => navigate(`/adoption/apply?lang=${lang}`)}

                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                >
                    {t.getStarted}
                </button>
            </div>

            {/* Similar Pets */}
            <h3 className="text-center text-lg font-semibold mb-6">{t.similar}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">

                {similarPets.map((pet) => (
                    <div key={pet._id} className="text-center">
                        <img src={pet.imageUrl || "/images/pug.png"} alt={pet.name} className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
                        <div className="font-semibold text-sm">{pet.name}</div>
                        <div className="text-xs text-gray-500">{pet.breed}</div>
                        <button
                            onClick={() => navigate(`/dog/${pet._id}?lang=${lang}`)}
                            className="mt-2 text-purple-500 border border-purple-500 text-xs px-3 py-1 rounded hover:bg-purple-50"
                        >
                            {t.getStarted}

                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 whitespace-pre-line">
                {t.footer}
            </footer>
        </div>
    );
};

export default DogDetail;

