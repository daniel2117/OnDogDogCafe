import React, { useEffect, useState } from "react";

const Step6PetStory = ({ formData, setFormData, next, back, lang }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const [story, setStory] = useState(formData.petStory || "");

    const t = {
        en: {
            instructions:
                "Share anything here about your pet. (Your pet profile will be visible to the public. For your safety, do not include any personal details or contact information). Include information such as:",
            bullets: [
                "Your pet's history: how long you've had them, where you got them from and why you need to rehome them",
                "Details about who your pet has lived with, eg children and other pets",
                "Your pet's favourite activities",
                "A description of their personality, preferences and habits",
                "Anything they're scared of such as fireworks, people in uniform, other animals",
                "The type of food they eat including the brand and amount.",
                "Allergies, health conditions, and any medications your pet takes",
                "If you are listing a bonded pair, make sure you include details about both pets"
            ],
            placeholder: "Type Here ...",
            back: "Back",
            continue: "Continue"
        },
        zh: {
            instructions:
                "請在此分享您寵物的資訊。（寵物資料將公開展示，請勿輸入任何個人或聯絡資訊以確保安全。）您可以包括：",
            bullets: [
                "寵物的背景：飼養多久、從哪裡獲得、為何需要轉讓",
                "與誰同住：是否與小孩或其他動物共同生活過",
                "最喜歡的活動",
                "個性、喜好與習慣",
                "害怕什麼（例如煙火、穿制服的人、其他動物）",
                "食物品牌與份量",
                "過敏、健康問題、正在服用的藥物",
                "若是成對登記，請提供兩隻寵物的資訊"
            ],
            placeholder: "請輸入內容 ...",
            back: "返回",
            continue: "下一步"
        }
    };

    const i18n = t[lang];

    const handleNext = () => {
        if (!story.trim()) {
            alert(lang === 'zh' ? "請填寫寵物故事。" : "Please fill out your pet's story.");
            return;
        }
        setFormData(prev => ({ ...prev, petStory: story }));
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">
            <div className="w-full max-w-4xl">
                <p className="mb-4 text-sm text-gray-800 whitespace-pre-line">
                    {i18n.instructions}
                </p>
                <ul className="text-sm text-gray-600 list-disc ml-5 mb-4">
                    {i18n.bullets.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>

                <textarea
                    rows="8"
                    className="w-full p-3 border border-gray-300 rounded mb-6"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder={i18n.placeholder}
                />

                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">
                        ◀ {i18n.back}
                    </button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">
                        {i18n.continue} ▶
                    </button>
                </div>
                <button
                    onClick={next}
                    className="text-xs text-gray-400 underline"
                >
                    Skip verification for development →
                </button>
            </div>
        </div>
    );
};

export default Step6PetStory;
