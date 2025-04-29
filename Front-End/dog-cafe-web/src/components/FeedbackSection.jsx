import { useEffect, useState } from "react";
import { feedbackApi } from "../services/api";

const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (name.length <= 3) return "***@" + domain;
    return name.slice(0, 3) + "***@" + domain;
};

const FeedbackSection = ({ lang }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await feedbackApi.getList({ page: 1, limit: 3 });
                setFeedbacks(res.feedbacks || []);
            } catch (err) {
                console.error("Failed to fetch feedback", err);
            }
        };
        fetchFeedback();
    }, []);

    const t = {
        en: { title: "Recent Feedbacks" },
        zh: { title: "最近回饋" }
    };

    return (
        <div className="bg-white py-12 px-6 border-t">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">{t[lang].title}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {feedbacks.map((f) => (
                        <div key={f._id} className="border rounded-lg p-4 shadow">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{f.name}</span>
                                <span className="text-sm text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-yellow-500 text-sm mb-2">
                                {"★".repeat(Math.floor(f.rating)) + (f.rating % 1 ? "½" : "")}
                            </div>
                            <p className="text-sm text-gray-800 mb-2">"{f.comment}"</p>
                            <p className="text-xs text-gray-500">{maskEmail(f.email)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeedbackSection;
