import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import adoptionApi from '../../services/adoptionApi';

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

    const [page, setPage] = useState(1);
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const dogsPerPage = 9;

    useEffect(() => {
        fetchDogs();
    }, [page, filters]);

    const fetchDogs = async () => {
        try {
            setLoading(true);
            const response = await adoptionApi.getAllDogs(page, filters);
            setDogs(response.dogs);
            // Update total pages if needed
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

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
                    <select
                        className="border px-3 py-1 rounded"
                        onChange={(e) => handleFilterChange('breed', e.target.value)}
                    >
                        <option value="">{t.breed}</option>
                        <option value="Shiba">Shiba</option>
                        <option value="Retriever">Retriever</option>
                        <option value="Poodle">Poodle</option>
                    </select>
                    <select
                        className="border px-3 py-1 rounded"
                        onChange={(e) => handleFilterChange('color', e.target.value)}
                    >
                        <option value="">{t.color}</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Brown">Brown</option>
                    </select>
                    <select
                        className="border px-3 py-1 rounded"
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                    >
                        <option value="">{t.gender}</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <select
                        className="border px-3 py-1 rounded"
                        onChange={(e) => handleFilterChange('age', e.target.value)}
                    >
                        <option value="">{t.age}</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-6">4-6 years</option>
                        <option value="7+">7+ years</option>
                    </select>
                    <select
                        className="border px-3 py-1 rounded"
                        onChange={(e) => handleFilterChange('size', e.target.value)}
                    >
                        <option value="">{t.size}</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                    <button className="ml-2 border px-3 py-1 rounded bg-purple-500 text-white">{t.apply}</button>
                </div>
            </div>

            {/* Dog Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {dogs.map((dog) => (
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
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-30"
                >
                    Prev
                </button>
                {/* Assuming totalPages is updated dynamically */}
                {[...Array(Math.ceil(dogs.length / dogsPerPage))].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-purple-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={page === Math.ceil(dogs.length / dogsPerPage)}
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