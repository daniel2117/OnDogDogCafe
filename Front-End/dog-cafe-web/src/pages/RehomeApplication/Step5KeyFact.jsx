import React from "react";
import { useEffect } from "react";

const Step5KeyFacts = ({ formData, setFormData, next, back, lang, isModify }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const fields = [
        "shotsUpToDate",
        "microchipped",
        "houseTrained",
        "goodWithDogs",
        "goodWithCats",
        "goodWithKids",
        "purebred",
        "hasSpecialNeeds",
        "hasBehaviouralIssues"
    ];

    const labels = {
        en: [
            "Shots up to date",
            "Microchipped",
            "House-trained",
            "Good with Dogs",
            "Good with Cats",
            "Good with Kids",
            "Purebred",
            "Has Special Needs",
            "Has Behavioural Issues"
        ],
        zh: [
            "疫苗已注射",
            "已植入晶片",
            "已訓練如廁",
            "與狗相處良好",
            "與貓相處良好",
            "與小孩相處良好",
            "純種",
            "有特殊需求",
            "有行為問題"
        ]
    };

    const options = ["yes", "no", "unknown"];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, checklist: { ...prev.checklist, [field]: value } }));
    };

    const handleNext = () => {
        const facts = formData.checklist || {};
        const allAnswered = fields.every(f => facts[f]);
        if (!isModify && !allAnswered) {
            alert(lang === "zh" ? "請完成所有欄位。" : "Please answer all the fields.");
            return;
        }
        next();
    };
    const parseValue = (raw) => {
        if (raw === true) return "yes";
        if (raw === false) return "no";
        return raw || "";
    };



    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl space-y-4">
                {fields.map((field, i) => (
                    <div key={field} className="flex items-center gap-6">
                        <label className="w-48 text-sm font-semibold">
                            {labels[lang][i]}
                        </label>
                        {options.map(opt => (
                            <label key={opt} className="text-sm">
                                <input
                                    type="radio"
                                    name={field}
                                    value={opt}
                                    checked={parseValue(formData.checklist?.[field]) === opt}
                                    onChange={() => handleChange(field, opt)}
                                    className="mr-1"
                                />
                                {lang === "zh"
                                    ? opt === "yes"
                                        ? "是"
                                        : opt === "no"
                                            ? "否"
                                            : "不確定"
                                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </label>
                        ))}

                    </div>
                ))}

                <div className="flex justify-between mt-8">
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ {lang === 'zh' ? '返回' : 'Back'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        {lang === 'zh' ? '繼續' : 'Continue'} ▶
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step5KeyFacts;
