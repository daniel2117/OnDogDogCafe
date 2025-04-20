import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rehomingApi } from "../../services/api";

const Step8Confirm = ({ formData, back, lang }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const t = {
        title: lang === "zh" ? "請確認您的申請" : "Please confirm your application",
        desc1: lang === "zh" ? "請檢查以下資訊是否正確。提交後我們將進行審核。" : "Please review the information below. We'll process your application upon submission.",
        submit: lang === "zh" ? "提交申請" : "Submit Application",
        loading: lang === "zh" ? "提交中..." : "Submitting...",
        tryAgain: lang === "zh" ? "請再試一次" : "Please try again",
        goHome: lang === "zh" ? "返回首頁" : "Go To My Profile",
        back: lang === "zh" ? "返回" : "Back"
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = new FormData();

            for (const key in formData) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach((item, index) => {
                        if (item instanceof File) {
                            payload.append(`${key}`, item);
                        } else if (typeof item === "object") {
                            payload.append(`${key}[${index}]`, JSON.stringify(item));
                        } else {
                            payload.append(`${key}[${index}]`, item);
                        }
                    });
                } else if (typeof formData[key] === "object") {
                    payload.append(key, JSON.stringify(formData[key]));
                } else {
                    payload.append(key, formData[key]);
                }
            }

            await rehomingApi.submit(payload);
            navigate(`/home?lang=${lang}`);
        } catch (err) {
            alert(err.message || t.tryAgain);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-3xl">
                <h2 className="text-xl font-bold mb-4 text-center">{t.title}</h2>
                <p className="text-sm text-gray-600 text-center mb-6">{t.desc1}</p>

                <div className="bg-gray-50 border rounded p-4 mb-6 text-sm text-gray-800">
                    <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>

                <div className="flex justify-between mb-6">
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ {t.back}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        {submitting ? t.loading : t.submit}
                    </button>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate(`/home?lang=${lang}`)}
                        className="text-sm text-blue-600 underline"
                    >
                        {t.goHome}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step8Confirm;
