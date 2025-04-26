import React, { useEffect, useState } from "react";

const Step3PrimaryQuestion = ({ formData, setFormData, next, back, lang, toggleLang }) => {
    const [garden, setGarden] = useState(formData.garden || "");
    const [homeSituation, setHomeSituation] = useState(formData.homeSituation || "");
    const [householdSetting, setHouseholdSetting] = useState(formData.householdSetting || "");
    const [activityLevel, setActivityLevel] = useState(formData.activityLevel || "");
    const [incomeLevel, setIncomeLevel] = useState(formData.incomeLevel || "");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const handleNext = () => {
        if (!garden || !homeSituation || !householdSetting || !activityLevel || !incomeLevel) {
            alert(lang === 'zh' ? "請完成所有必填欄位。" : "Please complete all required fields.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            garden,
            homeSituation,
            householdSetting,
            activityLevel,
            incomeLevel
        }));
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <label className="block font-semibold mb-2">{lang === 'zh' ? "您有花園嗎？ *" : "Do you have a garden? *"}</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="garden" value="yes" checked={garden === "yes"} onChange={() => setGarden("yes")} />
                            {lang === 'zh' ? "有" : "Yes"}
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="garden" value="no" checked={garden === "no"} onChange={() => setGarden("no")} />
                            {lang === 'zh' ? "沒有" : "No"}
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">{lang === 'zh' ? "請描述您的居住情況 *" : "Please describe your living/home situation *"}</label>
                    <select className="w-full border p-2 rounded" value={homeSituation} onChange={e => setHomeSituation(e.target.value)}>
                        <option value="">{lang === 'zh' ? "請選擇" : "Please Select"}</option>
                        <option value="apartment">{lang === 'zh' ? "公寓" : "Apartment"}</option>
                        <option value="house">{lang === 'zh' ? "獨立屋" : "House"}</option>
                        <option value="shared">{lang === 'zh' ? "合租住房" : "Shared Housing"}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">{lang === 'zh' ? "請描述您的家庭組成 *" : "Can you describe your household setting *"}</label>
                    <select className="w-full border p-2 rounded" value={householdSetting} onChange={e => setHouseholdSetting(e.target.value)}>
                        <option value="">{lang === 'zh' ? "請選擇" : "Please Select"}</option>
                        <option value="single">{lang === 'zh' ? "單身成人" : "Single Adult"}</option>
                        <option value="family">{lang === 'zh' ? "有子女的家庭" : "Family with Children"}</option>
                        <option value="roommates">{lang === 'zh' ? "與室友同住" : "Living with Roommates"}</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">{lang === 'zh' ? "請描述家庭的活動程度 *" : "Can you describe the household's typical activity level *"}</label>
                    <select className="w-full border p-2 rounded" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                        <option value="">{lang === 'zh' ? "請選擇" : "Please Select"}</option>
                        <option value="low">{lang === 'zh' ? "低" : "Low"}</option>
                        <option value="moderate">{lang === 'zh' ? "中等" : "Moderate"}</option>
                        <option value="high">{lang === 'zh' ? "高" : "High"}</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-sm">{lang === 'zh' ? "您的收入水平是？ *" : "What is your income level? *"}</label>
                    <select className="w-full border p-2 rounded" value={incomeLevel} onChange={e => setIncomeLevel(e.target.value)}>
                        <option value="">{lang === 'zh' ? "請選擇" : "Please Select"}</option>
                        <option value="low">{lang === 'zh' ? "低於 HKD 15,000" : "Below HKD 15,000"}</option>
                        <option value="medium">{lang === 'zh' ? "HKD 15,000 - 30,000" : "HKD 15,000 - 30,000"}</option>
                        <option value="high">{lang === 'zh' ? "高於 HKD 30,000" : "Above HKD 30,000"}</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">
                        ◀ {lang === 'zh' ? "返回" : "Back"}
                    </button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">
                        {lang === 'zh' ? "繼續" : "Continue"} ▶
                    </button>
                </div>

                <div className="mt-10 text-center text-sm text-gray-500">
                    <p className="text-xs mt-2">©2025 by On Dog Dog Cafe.</p>
                </div>
            </div>
        </div>
    );
};

export default Step3PrimaryQuestion;
