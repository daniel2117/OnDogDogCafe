import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyPageHome = ({ lang, toggleLang }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Reservation");
    const [applications, setApplications] = useState({ reservations: [], adoptions: [], rehoming: [] });

    const tabs = ["Reservation", "Adoption", "Rehoming"];

    const t = {
        reservation: lang === "zh" ? "預約" : "Reservation",
        adoption: lang === "zh" ? "領養" : "Adoption",
        rehoming: lang === "zh" ? "重新安置" : "Rehoming",
        returnHome: lang === "zh" ? "返回首頁" : "Return Home"
    };

    useEffect(() => {
        const data = localStorage.getItem("applications");
        if (data) {
            setApplications(JSON.parse(data));
        }
    }, []);

    const renderTableRows = () => {
        if (activeTab === "Reservation") {
            return applications.reservations.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2">{item.time}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                </tr>
            ));
        } else if (activeTab === "Adoption") {
            return applications.adoptions.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                </tr>
            ));
        } else if (activeTab === "Rehoming") {
            return applications.rehoming.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2">{item.petName}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                </tr>
            ));
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                    <img src="/logo.png" alt="logo" className="h-14" />
                </div>
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {lang === "zh" ? "English" : "中文"}
                </button>
            </div>

            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center">My Page</h2>

                {/* Tabs */}
                <div className="flex justify-center mb-6 space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-lg font-semibold border-b-2 pb-1 ${activeTab === tab ? "border-purple-500 text-black" : "border-transparent text-gray-400"
                                }`}
                        >
                            {t[tab.toLowerCase()]}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="border p-4 rounded mb-8 overflow-x-auto">
                    <h3 className="font-semibold mb-4">
                        {activeTab === "Reservation" ? (lang === 'zh' ? "我的預約" : "My Booking") : (lang === 'zh' ? "我的申請" : "My Application")}
                    </h3>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">{activeTab === "Reservation" ? "Time" : "Pet / Application"}</th>
                                <th className="text-left py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={() => navigate(`/?lang=${lang}`)}
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                >
                    {t.returnHome}
                </button>
            </div>

            <div className="text-xs text-gray-500 mt-10">
                ©2025 by On Dog Dog Cafe.
            </div>
        </div>
    );
};

export default MyPageHome;
