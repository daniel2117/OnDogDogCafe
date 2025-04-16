import React, { useState } from "react";

const Step3PrimaryQuestion = ({ formData, setFormData, next, back }) => {
    const [garden, setGarden] = useState(formData.garden || "");
    const [homeSituation, setHomeSituation] = useState(formData.homeSituation || "");
    const [householdSetting, setHouseholdSetting] = useState(formData.householdSetting || "");
    const [activityLevel, setActivityLevel] = useState(formData.activityLevel || "");
    const [incomeLevel, setIncomeLevel] = useState(formData.incomeLevel || "");

    const handleNext = () => {
        if (!garden || !homeSituation || !householdSetting || !activityLevel || !incomeLevel) {
            alert("Please complete all required fields.");
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
                    <label className="block font-semibold mb-2">Do you have a garden? *</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="garden" value="yes" checked={garden === "yes"} onChange={() => setGarden("yes")} />
                            Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="garden" value="no" checked={garden === "no"} onChange={() => setGarden("no")} />
                            No
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Please describe your living/home situation *</label>
                    <select className="w-full border p-2 rounded" value={homeSituation} onChange={e => setHomeSituation(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="shared">Shared Housing</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Can you describe your household setting *</label>
                    <select className="w-full border p-2 rounded" value={householdSetting} onChange={e => setHouseholdSetting(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="single">Single Adult</option>
                        <option value="family">Family with Children</option>
                        <option value="roommates">Living with Roommates</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Can you describe the household's typical activity level *</label>
                    <select className="w-full border p-2 rounded" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-sm">What is your income level? *</label>
                    <select className="w-full border p-2 rounded" value={incomeLevel} onChange={e => setIncomeLevel(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="low">Below HKD 15,000</option>
                        <option value="medium">HKD 15,000 - 30,000</option>
                        <option value="high">Above HKD 30,000</option>
                    </select>
                </div>


                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ Back</button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">Continue ▶</button>
                </div>
                {/*Skip verification for development →*/}
                <div>
                    <button
                        onClick={next}
                        className="text-xs text-gray-400 underline"
                    >
                        Skip verification for development →
                    </button>
                </div>

                <div className="mt-10 text-center text-sm text-gray-500">
                    <p>6613 2128</p>
                    <p className="mt-1">何文田梭椏道3號1樓<br />1/F, 3 Soares Avenue</p>
                    <p className="text-xs mt-2">©2025 by On Dog Dog Cafe.</p>
                </div>
            </div>
        </div>
    );
};

export default Step3PrimaryQuestion;
