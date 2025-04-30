import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rehomingApi } from "../../services/api";

const Step8Confirm = ({ formData, back, lang, isModify }) => {
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
            const checklistRaw = formData.checklist || {};

            const checklist = {
                shotsUpToDate: checklistRaw.shotsUpToDate === "yes",
                microchipped: checklistRaw.microchipped === "yes",
                houseTrained: checklistRaw.houseTrained === "yes",
                goodWithDogs: checklistRaw.goodWithDogs === "yes",
                goodWithCats: checklistRaw.goodWithCats === "yes",
                goodWithKids: checklistRaw.goodWithKids === "yes",
                purebred: checklistRaw.purebred === "yes",
                hasSpecialNeeds: checklistRaw.specialNeeds === "yes",
                hasBehaviouralIssues: checklistRaw.behaviouralIssues === "yes",
            };
            console.log("checklistRaw" + checklistRaw);

            const uploadedPhotos = (formData.uploadedPhotos || []);
            console.log(formData);
            // Assume formData.documents is an array of File objects
            const uploadedDocuments = (formData.uploadedDocuments || [])
                .map((url, index) => ({
                    type: "other",
                    url,
                    name: formData.documents?.[index]?.name || "Uploaded file"
                }));

            const payload = {
                ownerInfo: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                },
                petInfo: {
                    name: formData.petName,
                    type: formData.petType,
                    age: Number(formData.age),
                    size: formData.size,
                    gender: formData.gender,
                    breed: formData.breed,
                    color: formData.color,
                    isSpayedNeutered: formData.neutered === 'yes',
                    description: formData.petStory,
                    checklist: checklist
                },
                rehomingDetails: {
                    reason: formData.reason,
                    timeWindow: formData.duration
                },
                media: {
                    photos: uploadedPhotos,
                    documents: uploadedDocuments
                }
            };

            await rehomingApi.submit(payload);
            navigate(`/home?lang=${lang}`);
        } catch (err) {
            alert(err.message || t.tryAgain);
        } finally {
            setSubmitting(false);
        }
    };

    const renderSummary = () => {
        const summary = [];

        for (const key in formData) {
            const value = formData[key];

            if (key === "uploadedPhotos" || key === "uploadedDocuments") {
                continue;
            }

            if ((key === "photos" || key === "uploadedPhotos") && Array.isArray(value)) {
                summary.push(
                    <div key={key} className="mb-4">
                        <strong>{key}:</strong>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {value.map((item, idx) => (
                                <img
                                    key={idx}
                                    src={typeof item === "string"
                                        ? item // uploadedPhotos일 경우 (string)
                                        : URL.createObjectURL(item) // photos일 경우 (File 객체)
                                    }
                                    alt={`photo-${idx}`}
                                    className="h-24 w-24 object-cover border rounded"
                                />
                            ))}
                        </div>
                    </div>
                );


            } else if ((key === "uploadedDocuments" || key === "documents") && Array.isArray(value)) {
                summary.push(
                    <div key={key} className="mb-4">
                        <strong>{key}:</strong>
                        <ul className="list-disc list-inside text-xs ml-2 mt-2">
                            {value.map((doc, idx) => (
                                <li key={idx}>
                                    {doc.name || "Uploaded file"}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (typeof value === "string" || typeof value === "number") {
                summary.push(
                    <div key={key} className="mb-2">
                        <strong>{key}:</strong> {value}
                    </div>
                );
            } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
                summary.push(
                    <div key={key} className="mb-2">
                        <strong>{key}:</strong>
                        <pre className="text-xs text-gray-600 ml-2 whitespace-pre-wrap">
                            {JSON.stringify(value, null, 2)}
                        </pre>
                    </div>
                );
            }
        }
        return summary;
    };


    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-3xl">
                <h2 className="text-xl font-bold mb-4 text-center">{t.title}</h2>
                <p className="text-sm text-gray-600 text-center mb-6">{t.desc1}</p>

                <div className="bg-gray-50 border rounded p-4 mb-6 text-sm text-gray-800">
                    {renderSummary()}
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
