import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "../../components/FeedbackForm";
import { reservationApi, adoptionApi, rehomingApi, myPageApi } from "../../services/api";

const MyPageHome = ({ lang, toggleLang }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Reservation");
    const [applications, setApplications] = useState({ reservations: [], adoptions: [], rehoming: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");

    const tabs = ["Reservation", "Adoption", "Rehoming"];
    const verifiedEmail = localStorage.getItem("verifiedEmail");

    const t = {
        reservation: lang === "zh" ? "預約" : "Reservation",
        adoption: lang === "zh" ? "領養" : "Adoption",
        rehoming: lang === "zh" ? "重新安置" : "Rehoming",
        returnHome: lang === "zh" ? "返回首頁" : "Return Home"
    };

    useEffect(() => {
        const fetchApplications = async () => {
            if (!verifiedEmail) return;
            setIsLoading(true);
            try {
                const res = await myPageApi.getApplications(verifiedEmail);
                if (res) {
                    setApplications(res);
                    localStorage.setItem("applications", JSON.stringify(res));
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
                alert("Failed to load your applications. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, [verifiedEmail]);

    const handleCancel = async (id) => {
        try {
            await reservationApi.cancel(id, verifiedEmail);
            const updatedReservations = applications.reservations.map(res =>
                res.id === id ? { ...res, status: 'cancelled' } : res
            );
            setApplications(prev => ({ ...prev, reservations: updatedReservations }));
        } catch (error) {
            alert(error.message || 'Failed to cancel reservation');
        }
    };

    const handleWithdraw = async (type, id) => {
        try {
            if (type === 'adoption') {
                await adoptionApi.withdraw(id);
            } else if (type === 'rehoming') {
                await rehomingApi.withdraw(id);
            }
            window.location.reload();
        } catch (err) {
            alert(err.message || 'Failed to withdraw application.');
        }
    };

    const renderRows = () => {
        const today = new Date();
        if (activeTab === "Reservation") {
            return applications.reservations.map((item, idx) => {
                const reservationDate = new Date(item.date);
                const isPast = reservationDate < today;
                const isCancelled = item.status === 'cancelled';
                return (
                    <tr key={idx} className="border-b">
                        <td className="py-2">{reservationDate.toLocaleDateString()}</td>
                        <td className="py-2">{item.time}</td>
                        <td className="py-2">{item.reservedFacility}</td>
                        <td className="py-2">{item.specialRequest}</td>
                        <td className="py-2 capitalize">{item.status}</td>
                        <td className="py-2">
                            {!isCancelled && (
                                <div className="flex gap-2 flex-wrap">
                                    {isPast ? (
                                        <button
                                            className="bg-purple-200 text-purple-800 px-3 py-1 rounded text-xs"
                                            onClick={() => {
                                                setSelectedEmail(verifiedEmail);
                                                setShowFeedbackForm(true);
                                            }}
                                        >
                                            Leave Feedback
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="bg-purple-500 text-white px-3 py-1 rounded text-xs"
                                                onClick={async () => {
                                                    try {
                                                        const res = await reservationApi.getById(item.id);
                                                        navigate("/bookingDetail", {
                                                            state: {
                                                                modify: true,
                                                                reservation: res
                                                            }
                                                        });
                                                    } catch (err) {
                                                        alert(err.message || "Failed to load reservation.");
                                                    }
                                                }}
                                            >
                                                Modify Booking
                                            </button>

                                            <button
                                                className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                                                onClick={() => handleCancel(item.id)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </td>
                    </tr>
                );
            });
        }
        if (activeTab === "Adoption") {
            return applications.adoptions.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                    <td className="py-2">
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className="bg-purple-500 text-white px-3 py-1 rounded text-xs"
                                onClick={async () => {
                                    try {
                                        const res = await adoptionApi.getApplication(item.id);
                                        navigate("/adoption-application-view", { state: { application: res.application } });
                                    } catch (err) {
                                        alert(err.message || "Failed to fetch application.");
                                    }
                                }}
                            >
                                View Application
                            </button>
                            {item.status === 'pending' && (
                                <button
                                    className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => handleWithdraw('adoption', item.id)}
                                >
                                    Withdraw
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            ));
        }
        if (activeTab === "Rehoming") {
            return applications.rehoming.map((item, idx) => (
                <tr key={idx} className="border-b">
                    <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-2">{item.petName}</td>
                    <td className="py-2 capitalize">{item.status}</td>
                    <td className="py-2">
                        <div className="flex gap-2 flex-wrap">
                            <button
                                className="bg-purple-500 text-white px-3 py-1 rounded text-xs"
                                onClick={async () => {
                                    try {
                                        const res = await rehomingApi.getApplication(item.id);
                                        navigate("/rehoming-application-view", { state: { application: res } });
                                    } catch (err) {
                                        alert(err.message || "Failed to fetch application.");
                                    }
                                }}
                            >
                                View Application
                            </button>
                            {item.status === 'pending' && (
                                <button
                                    className="bg-gray-400 text-white px-3 py-1 rounded text-xs"
                                    onClick={() => handleWithdraw('rehoming', item.id)}
                                >
                                    Withdraw
                                </button>
                            )}
                        </div>
                    </td>
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
                            className={`text-lg font-semibold border-b-2 pb-1 ${activeTab === tab ? "border-purple-500 text-black" : "border-transparent text-gray-400"}`}
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

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Loading...</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Date</th>
                                    <th className="text-left py-2">{activeTab === "Reservation" ? "Time" : "Pet / Application"}</th>
                                    {activeTab === "Reservation" && (
                                        <>
                                            <th className="text-left py-2">Facility</th>
                                            <th className="text-left py-2">Request</th>
                                        </>
                                    )}
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRows()}
                            </tbody>
                        </table>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/?lang=${lang}`)}
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                >
                    {t.returnHome}
                </button>
            </div>

            {showFeedbackForm && (
                <FeedbackForm
                    email={selectedEmail}
                    onClose={() => {
                        setSelectedEmail("");
                        setShowFeedbackForm(false);
                    }}
                />
            )}

            <div className="text-xs text-gray-500 mt-10">
                ©2025 by On Dog Dog Cafe.
            </div>
        </div>
    );
};

export default MyPageHome;
