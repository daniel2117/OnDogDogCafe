import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adoptionApi } from "../../services/api";

const DogDetail = ({ lang, toggleLang }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dog, setDog] = useState(null);
    const [similarPets, setSimilarPets] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
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
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe.",
            story: "Story",
            health: "Health Records",
            vaccHistory: "Vaccination History"
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
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe.",
            story: "狗狗故事",
            health: "健康紀錄",
            vaccHistory: "疫苗接種"
        },
    };

    const t = texts[lang];

    if (!dog) return <div className="p-6 text-center">Loading...</div>;

    const displayName = dog.translations?.[lang]?.name || dog.name;
    const displayDescription = dog.translations?.[lang]?.description || dog.description;

    return (
        <div className="px-4 py-6 text-gray-700 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <img src="/logo.png" alt="logo" className="h-16 cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)} />
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {lang === "en" ? "中文" : "English"}
                </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <img src={dog.imageUrl} alt="dog profile" className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    <p className="text-sm text-gray-500">Pet ID: {dog.petId}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3">
                    <img
                        src={dog.images?.[selectedImage] || "/images/pug.png"}
                        alt="dog"
                        className="w-full h-80 object-cover rounded-xl mb-3"
                    />
                    <div className="flex gap-2 overflow-x-auto">
                        {dog.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumb-${idx}`}
                                onClick={() => setSelectedImage(idx)}
                                className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedImage === idx ? "border-purple-500" : "border-transparent"}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/3 space-y-3">
                    <h2 className="font-semibold text-lg">{displayName} {t.story}</h2>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{displayDescription}</p>

                    <ul className="text-sm space-y-1">
                        {dog.personality?.map((p, i) => <li key={i}>✔️ {p}</li>)}
                        {dog.requirements?.map((r, i) => <li key={i}>📌 {r}</li>)}
                    </ul>

                    <div className="space-y-1 text-sm text-gray-700 pt-3">
                        {dog.vaccinated && <div>💉 {t.vaccinated}</div>}
                        {dog.neutered && <div>⚖️ Neutered</div>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-center text-purple-700 my-10">
                <div className="border rounded p-2">{t.gender}: {dog.gender}</div>
                <div className="border rounded p-2">{t.breed}: {dog.breed}</div>
                <div className="border rounded p-2">{t.age}: {dog.age}</div>
                <div className="border rounded p-2">{t.color}: {dog.color}</div>
                <div className="border rounded p-2">{t.weight}: {dog.weight} kg</div>
                <div className="border rounded p-2">{t.height}: {dog.height} cm</div>
            </div>

            {dog.healthRecords?.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-md font-bold mb-2">🩺 {t.health}</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {dog.healthRecords.map((record, i) => (
                            <li key={i}>{record.date?.substring(0, 10)} - {record.type}: {record.description}</li>
                        ))}
                    </ul>
                </div>
            )}

            {dog.vaccinations?.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-md font-bold mb-2">💉 {t.vaccHistory}</h3>
                    <table className="w-full text-sm text-left border rounded">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Age</th>
                                <th className="p-2">Vaccine</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dog.vaccinations.map((v, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-2">{v.age}</td>
                                    <td className="p-2">{v.vaccinated}</td>
                                    <td className="p-2">{v.match}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="text-center mb-12">
                <p className="mb-2 font-semibold">{t.interested}</p>
                <button
                    onClick={() => navigate(`/adoption/apply?lang=${lang}`)}
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                >
                    {t.getStarted}
                </button>
            </div>

            <h3 className="text-lg font-bold text-center mb-6">{t.similar}</h3>
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

            <footer className="text-center text-sm text-gray-500 whitespace-pre-line">
                {t.footer}
            </footer>
        </div>
    );
};

export default DogDetail;
