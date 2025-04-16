// import React from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";

// const DogDetail = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(useLocation().search);
//     const lang = queryParams.get("lang") || "en";

//     const texts = {
//         en: {
//             gender: "Gender",
//             breed: "Breed",
//             age: "Age",
//             color: "Color",
//             weight: "Weight",
//             height: "Height",
//             vaccinated: "Vaccinated",
//             interested: "If you are interested to adopt",
//             getStarted: "Get started",
//             similar: "Similar Pets",
//             footer: "1F, 3 Soares Avenue, Hong Kong\nTel: 6613 2128\n©2025 by On Dog Dog Cafe."
//         },
//         zh: {
//             gender: "性別",
//             breed: "品種",
//             age: "年齡",
//             color: "顏色",
//             weight: "體重",
//             height: "身高",
//             vaccinated: "疫苗記錄",
//             interested: "若您有興趣領養",
//             getStarted: "開始預約",
//             similar: "類似狗狗",
//             footer: "香港蘇沙道3號1樓\n電話: 6613 2128\n©2025 On Dog Dog Cafe."
//         },
//     };

//     const t = texts[lang];

//     // Dummy data for the dog
//     const dog = {
//         name: "Magie",
//         petId: "80638810",
//         profile: "/images/3.jpeg",
//         images: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg"],
//         gender: "Female",
//         breed: "Shiba Inu",
//         age: "14 month",
//         color: "Red",
//         weight: "12 lb",
//         height: "91 cm",
//         story: `We have had Magie since she was able to leave her mum as a puppy so at 8 weeks old.\nMagie currently lives with two children age 7 and 13 and has many visitors to the house which are children she is great with kids.\nThere's lots of cats, birds etc around the area and in the garden on most days as she's not fussed by these.`,
//         health: ["Can live with other children of any age", "Vaccinated", "House-Trained", "Neutered", "Shots up to date", "Microchipped"]
//     };

//     const similarPets = ["Lisa", "Bella", "Lucy", "Stella"];

//     return (
//         <div className="px-6 py-6 text-gray-700">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <img src="/logo.png" alt="logo" className="h-16 cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)} />
//                 <button
//                     onClick={() => navigate(`/contactus?lang=${lang}`)}
//                     className="border px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                     Contact Us
//                 </button>
//             </div>

//             {/* Profile Section */}
//             <div className="flex items-center gap-4 mb-6">
//                 <img src={dog.profile} alt="dog profile" className="w-16 h-16 rounded-full object-cover" />
//                 <div>
//                     <div className="text-xl font-bold">{dog.name}</div>
//                     <div className="text-sm text-blue-600">Pet ID: {dog.petId}</div>
//                 </div>
//             </div>

//             {/* Main Image */}
//             <img src={dog.profile} alt="main" className="w-full max-h-[400px] object-cover rounded mb-4" />

//             {/* Thumbnails */}
//             <div className="flex gap-2 mb-6">
//                 {dog.images.map((img, i) => (
//                     <img
//                         key={i}
//                         src={`/images/${img}`}
//                         alt={`thumb-${i}`}
//                         className="w-24 h-20 object-cover rounded cursor-pointer"
//                     />
//                 ))}
//             </div>

//             {/* Story + Health Info */}
//             <div className="grid md:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-gray-100 p-4 rounded">
//                     <div className="font-semibold mb-2">Magie Story</div>
//                     <p className="text-sm whitespace-pre-line">{dog.story}</p>
//                 </div>

//                 <div className="flex flex-col gap-3 text-sm">
//                     {dog.health.map((item, i) => (
//                         <div key={i} className="flex items-center gap-2">
//                             <span>✔️</span>
//                             <span>{item}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Tags */}
//             <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs text-center text-purple-700 mb-6">
//                 <div className="border rounded p-2">{t.gender}: {dog.gender}</div>
//                 <div className="border rounded p-2">{t.breed}: {dog.breed}</div>
//                 <div className="border rounded p-2">{t.age}: {dog.age}</div>
//                 <div className="border rounded p-2">{t.color}: {dog.color}</div>
//                 <div className="border rounded p-2">{t.weight}: {dog.weight}</div>
//                 <div className="border rounded p-2">{t.height}: {dog.height}</div>
//             </div>

//             {/* Vaccination Table */}
//             <div className="overflow-x-auto mb-10">
//                 <table className="min-w-full border text-sm">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border px-4 py-2">{t.age}</th>
//                             <th className="border px-4 py-2">{t.vaccinated}</th>
//                             <th className="border px-4 py-2">Match</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td className="border px-4 py-2">8th Week</td>
//                             <td className="border px-4 py-2">Bordetella</td>
//                             <td className="border px-4 py-2">Leptospirosis</td>
//                         </tr>
//                         <tr>
//                             <td className="border px-4 py-2">14th Week</td>
//                             <td className="border px-4 py-2">Bordetella, Canine Anfluanza</td>
//                             <td className="border px-4 py-2">Leptospirosis</td>
//                         </tr>
//                         <tr>
//                             <td className="border px-4 py-2">22th Week</td>
//                             <td className="border px-4 py-2">Bordetella, Canine Anfluanza</td>
//                             <td className="border px-4 py-2">Leptospirosis</td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>

//             {/* Adopt Button */}
//             <div className="text-center mb-10">
//                 <div className="mb-2 font-semibold">{t.interested}</div>
//                 <button
//                     onClick={() => navigate(`/booking?lang=${lang}`)}
//                     className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
//                 >
//                     {t.getStarted}
//                 </button>
//             </div>

//             {/* Similar Pets */}
//             <h3 className="text-center text-lg font-semibold mb-6">{t.similar}</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
//                 {similarPets.map((name, i) => (
//                     <div key={i} className="text-center">
//                         <img src={`/images/${name.toLowerCase()}.jpeg`} alt={name} className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
//                         <div className="font-semibold text-sm">{name}</div>
//                         <div className="text-xs text-gray-500">Shiba Inu</div>
//                         <button
//                             onClick={() => navigate(`/dog/${id}?lang=${lang}`)}
//                             className="mt-2 text-purple-500 border border-purple-500 text-xs px-3 py-1 rounded hover:bg-purple-50"
//                         >
//                             {t.moreInfo}
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Footer */}
//             <footer className="text-center text-sm text-gray-500 whitespace-pre-line">
//                 {t.footer}
//             </footer>
//         </div>
//     );
// };

// export default DogDetail;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dogCafeApi from "../../services/api";

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
                const response = await dogCafeApi.getDogDetails(id);
                setDog(response);
            } catch (error) {
                console.error("Error fetching dog detail:", error);
            }
        };

        const fetchSimilar = async () => {
            try {
                const response = await dogCafeApi.getSimilarDogs(id);
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
            footer: "1F, 3 Soares Avenue, Hong Kong\nTel: 6613 2128\n©2025 by On Dog Dog Cafe."
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
            footer: "香港蘇沙道3號1樓\n電話: 6613 2128\n©2025 On Dog Dog Cafe."
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
                    <div className="text-sm text-blue-600">Pet ID: {dog._id}</div>
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
                    onClick={() => navigate(`/booking?lang=${lang}`)}
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
