import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { adoptionApi } from "../../services/api";


const Adoption = ({ lang, toggleLang }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    //const lang = queryParams.get("lang") || "en";

    const [dogs, setDogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dogsPerPage = 9;

    const [filters, setFilters] = useState({ breed: '', color: '', gender: '', age: '', size: '' });
    const [filterOptions, setFilterOptions] = useState({});
    const [pendingFilters, setPendingFilters] = useState({ breed: '', color: '', gender: '', age: '', size: '' });


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        const fetchFilterOptions = async () => {
            try {
                const response = await adoptionApi.getFilters();
                setFilterOptions(response);

            } catch (error) {
                console.error("Failed to load filter options:", error);
            }
        };
        fetchFilterOptions();
    }, []);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const fetchDogs = async () => {
            try {
                const response = await adoptionApi.getDogs({
                    page,
                    limit: dogsPerPage,
                    ...filters
                });
                setDogs(response.dogs);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Failed to load adoption dogs:", error);
            }
        };
        fetchDogs();
    }, [page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setPendingFilters(prev => ({ ...prev, [name]: value }));
    };


    const applyFilters = () => {
        setFilters({ ...pendingFilters });
        setPage(1);
    };




    const texts = {
        en: {
            language: "中文",
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
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe."
        },
        zh: {
            language: "English",
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
            footer: "Kwai Chung, Lai King Hill Rd, Lai Chi Kok Bay Garden Block D\n©2025 by On Dog Dog Cafe."
        },
    };

    const t = texts[lang];


    return (
        <div className="min-h-screen bg-white px-6 py-4 text-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                    <img src="/logo.png" alt="logo" className="h-16" />
                </div>
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {t.language}
                </button>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{t.filter}</h2>
                <div className="flex gap-2">
                    {filterOptions.breed?.length > 0 && (
                        <select name="breed" value={pendingFilters.breed} onChange={handleFilterChange} className="border px-3 py-1 rounded">
                            <option value="">{t.breed}</option>
                            {filterOptions.breed.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {filterOptions.color?.length > 0 && (
                        <select name="color" value={pendingFilters.color} onChange={handleFilterChange} className="border px-3 py-1 rounded">
                            <option value="">{t.color}</option>
                            {filterOptions.color.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {filterOptions.gender?.length > 0 && (
                        <select name="gender" value={pendingFilters.gender} onChange={handleFilterChange} className="border px-3 py-1 rounded">
                            <option value="">{t.gender}</option>
                            {filterOptions.gender.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {filterOptions.age?.length > 0 && (
                        <select name="age" value={pendingFilters.age} onChange={handleFilterChange} className="border px-3 py-1 rounded">
                            <option value="">{t.age}</option>
                            {filterOptions.age.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    {filterOptions.size?.length > 0 && (
                        <select name="size" value={pendingFilters.size} onChange={handleFilterChange} className="border px-3 py-1 rounded">
                            <option value="">{t.size}</option>
                            {filterOptions.size.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    )}
                    <button
                        onClick={applyFilters}
                        className="ml-2 border px-3 py-1 rounded bg-purple-500 text-white"
                    >
                        {t.apply}
                    </button>
                </div>
            </div>

            {/* Dog Cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {dogs.map((dog) => (
                    <div key={dog._id} className="border rounded-lg p-4 shadow hover:shadow-md">
                        <img src={dog.imageUrl || "/images/pug.png"} alt={dog.name} className="w-full h-48 object-cover rounded mb-4" />
                        <div className="mb-2 text-lg font-bold">{dog.name}</div>
                        <div className="text-sm mb-1">Gender: {dog.gender}</div>
                        <div className="text-sm mb-1">Breed: {dog.breed}</div>
                        <div className="text-sm mb-1">Age: {dog.age}</div>
                        <div className="text-sm mb-1">Size: {dog.size}</div>
                        <p className="text-sm text-gray-500 mb-2">{dog.description}</p>
                        <button
                            className="w-full border border-purple-500 text-purple-500 rounded px-4 py-2 text-sm hover:bg-purple-50"
                            onClick={() => navigate(`/dog/${dog._id}?lang=${lang}`)}
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

                    onClick={() => {
                        setPage((p) => p - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}

                    className="px-3 py-1 border rounded disabled:opacity-30"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}

                        className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-purple-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button

                    disabled={page === totalPages}
                    onClick={() => {
                        setPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}

                    className="px-3 py-1 border rounded disabled:opacity-30"
                >
                    Next
                </button>
            </div>

            {/* Book Now Button */}
            <div className="flex justify-center mt-10">
                <button

                    onClick={() => navigate(`/adoption/apply?lang=${lang}`)}

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

