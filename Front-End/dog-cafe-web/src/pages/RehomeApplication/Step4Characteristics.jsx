import React, { useEffect, useState } from "react";
import { adoptionApi } from "../../services/api";

const Step4Characteristics = ({ formData, setFormData, next, back, lang, isModify }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const t = {
        petName: lang === 'zh' ? "寵物名字" : "Pet's Name",
        age: lang === 'zh' ? "年齡（歲）" : "Age (Years)",
        size: lang === 'zh' ? "體型" : "Size",
        gender: lang === 'zh' ? "性別" : "Gender",
        breed: lang === 'zh' ? "品種" : "Breed(s)",
        color: lang === 'zh' ? "毛色" : "Colors",
        select: lang === 'zh' ? "請選擇" : "Please select",
        pick: lang === 'zh' ? "請選擇一項" : "Pick a value",
        all: lang === 'zh' ? "全部" : "All",
        back: lang === 'zh' ? "返回" : "Back",
        continue: lang === 'zh' ? "繼續" : "Continue",
    };

    const ageOptions = Array.from({ length: 21 }, (_, i) => i.toString());
    const sizeOptions = ["small", "medium", "large"];
    const genderOptions = ["male", "female"];
    const breedOptions = [
        "Australian Cattle Dog", "Australian Shepherd", "Beagle", "Border Collie", "Boston Terrier",
        "Cane Corso", "Cardigan Welsh Corgi", "Chihuahua", "Cocker Spaniel", "Dachshund",
        "Doberman Pinscher", "French Bulldog", "German Shepherd", "Golden Retriever", "Goldendoodle",
        "Great Dane", "Irish Setter", "Italian Greyhound", "Labrador Retriever", "Maltese",
        "Pembroke Welsh Corgi", "Pomeranian", "Poodle", "Pug", "Samoyed",
        "Shetland Sheepdog", "Shiba Inu", "Siberian Husky", "Standard Poodle", "Vizsla",
        "Weimaraner", "Mixed", "Unknown", "Other"
    ];
    const colorOptions = [
        "Apricot", "Black", "Black and White", "Blue", "Blue Heeler",
        "Blue Merle", "Brown", "Chestnut", "Chocolate", "Cream",
        "Dark Gray", "Fawn", "Golden", "Gray", "Harlequin",
        "Mahogany", "Orange-red", "Red", "Red & White", "Red and White",
        "Rust-colored", "Sable", "Seal", "Silver", "Tan",
        "Tan and Black", "Tri-color", "White", "Yellow", "Brindle",
        "Merle", "Mixed", "Unknown", "Other"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        const required = ["petName", "age", "size", "gender", "breed", "color"];
        for (const field of required) {
            if (!formData[field]) {
                alert("Please complete all fields.");
                return;
            }
        }
        next();
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
            <div className="w-full max-w-3xl space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">{t.petName} *</label>
                    <input
                        name="petName"
                        value={formData.petName || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder={t.petName}
                    />
                    <p className="text-xs text-gray-500 mt-1">{lang === 'zh' ? "如為幼犬請輸入 0 歲" : "If your pet is a puppy then add their age as 0"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.age} *</label>
                        <select name="age" value={formData.age || ""} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">{t.select}</option>
                            {ageOptions.map((age) => <option key={age} value={age}>{age}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.size} *</label>
                        <select name="size" value={formData.size || ""} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">{t.select}</option>
                            {sizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.gender} *</label>
                        <select name="gender" value={formData.gender || ""} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">{t.select}</option>
                            {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.breed} *</label>
                        <select name="breed" value={formData.breed || ""} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">{t.pick}</option>
                            {breedOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.color} *</label>
                        <select name="color" value={formData.color || ""} onChange={handleChange} className="w-full border p-2 rounded">
                            <option value="">{t.all}</option>
                            {colorOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ {t.back}</button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">{t.continue} ▶</button>
                </div>
            </div>
        </div>
    );
};

export default Step4Characteristics;