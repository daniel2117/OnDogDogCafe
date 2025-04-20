import React, { useEffect, useState } from "react";

const Step2PrimaryQuestion = ({ formData, setFormData, next, back, lang }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const [petType, setPetType] = useState(formData.petType || "");
    const [neutered, setNeutered] = useState(formData.neutered || "");
    const [reason, setReason] = useState(formData.reason || "");
    const [duration, setDuration] = useState(formData.duration || "");

    const t = {
        title: lang === 'zh' ? "主要問題" : "Primary Questions",
        petTypeQ: lang === 'zh' ? "您要重新安置的是狗還是貓？" : "Are you rehoming a dog or cat?",
        neuteredQ: lang === 'zh' ? "您的寵物是否已絕育？" : "Is your pet spayed or neutered?",
        reasonQ: lang === 'zh' ? "您為何需要重新安置您的寵物？" : "Why do you need to rehome your pet?",
        durationQ: lang === 'zh' ? "在我們幫助找到新家之前，您能照顧寵物多久？" : "How long are you able to keep your pet while we help find a suitable new home?",
        dog: lang === 'zh' ? "狗" : "Dog",
        cat: lang === 'zh' ? "貓" : "Cat",
        yes: lang === 'zh' ? "是" : "Yes",
        no: lang === 'zh' ? "否" : "No",
        pick: lang === 'zh' ? "請選擇" : "Pick a value",
        continue: lang === 'zh' ? "繼續" : "Continue",
        back: lang === 'zh' ? "返回" : "Back",
        alert: lang === 'zh' ? "請完成所有欄位。" : "Please complete all fields."
    };

    const handleNext = () => {
        if (!petType || !neutered || !reason || !duration) {
            alert(t.alert);
            return;
        }
        setFormData(prev => ({ ...prev, petType, neutered, reason, duration }));
        next();
    };

    return (
        <div className="max-w-3xl mx-auto text-sm text-gray-700">
            <h2 className="text-xl font-bold mb-6">{t.title}</h2>

            <div className="mb-4">
                <p className="mb-1 font-semibold">{t.petTypeQ}</p>
                <label className="mr-4">
                    <input type="radio" value="dog" checked={petType === "dog"} onChange={() => setPetType("dog")} /> {t.dog}
                </label>
                <label>
                    <input type="radio" value="cat" checked={petType === "cat"} onChange={() => setPetType("cat")} /> {t.cat}
                </label>
            </div>

            <div className="mb-4">
                <p className="mb-1 font-semibold">{t.neuteredQ}</p>
                <label className="mr-4">
                    <input type="radio" value="yes" checked={neutered === "yes"} onChange={() => setNeutered("yes")} /> {t.yes}
                </label>
                <label>
                    <input type="radio" value="no" checked={neutered === "no"} onChange={() => setNeutered("no")} /> {t.no}
                </label>
            </div>

            <div className="mb-4">
                <label className="block mb-1 font-semibold">{t.reasonQ}</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border rounded p-2">
                    <option value="">{t.pick}</option>
                    <option value="moving">{lang === 'zh' ? "搬家" : "Moving"}</option>
                    <option value="allergy">{lang === 'zh' ? "過敏" : "Allergy"}</option>
                    <option value="financial">{lang === 'zh' ? "財務困難" : "Financial Issue"}</option>
                    <option value="behavior">{lang === 'zh' ? "行為問題" : "Behavior Issue"}</option>
                    <option value="other">{lang === 'zh' ? "其他" : "Other"}</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block mb-1 font-semibold">{t.durationQ}</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded p-2">
                    <option value="">{lang === 'zh' ? "請選擇" : "Please Select"}</option>
                    <option value="1week">{lang === 'zh' ? "1週內" : "Within 1 week"}</option>
                    <option value="2weeks">{lang === 'zh' ? "2週內" : "Within 2 weeks"}</option>
                    <option value="1month">{lang === 'zh' ? "1個月內" : "Within 1 month"}</option>
                    <option value="longer">{lang === 'zh' ? "更長時間" : "Longer"}</option>
                </select>
            </div>

            <div className="flex justify-between">
                <button onClick={back} className="border border-gray-400 px-4 py-2 rounded">{t.back}</button>
                <button onClick={handleNext} className="bg-purple-600 text-white px-4 py-2 rounded">{t.continue}</button>
            </div>
            <button
                onClick={next}
                className="text-xs text-gray-400 underline"
            >
                Skip verification for development →
            </button>
        </div>
    );
};

export default Step2PrimaryQuestion;
