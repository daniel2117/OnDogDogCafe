import React, { useState } from "react";

const Step3PetImages = ({ formData, setFormData, next, back, lang }) => {
    const [dragIndex, setDragIndex] = useState(null);

    const t = {
        instruction: lang === 'zh'
            ? "請上傳您寵物的4張照片。（至少需要2張，但建議上傳4張）"
            : "Please add 4 photos of your pet. (A minimum of 2 photos are required but uploading 4 is better!)",
        note: lang === 'zh'
            ? "圖片格式應為 (.jpg, .png, .jpeg)。\n尺寸需為600x600像素正方形。\n檔案大小應在240到1024KB之間。"
            : "The image format should be (.jpg, .png, .jpeg).\nThe image measurements must be square in shape, with dimensions of 600 × 600 pixels.\nThe maximum & minimum image size is 1024 and 240 KB.",
        back: lang === 'zh' ? "返回" : "Back",
        continue: lang === 'zh' ? "繼續" : "Continue",
        alert: lang === 'zh' ? "請至少上傳兩張圖片。" : "Please upload at least 2 images.",
        skip: lang === 'zh' ? "跳過驗證（開發用途）→" : "Skip verification for development →"
    };

    const handleImageChange = (index, file) => {
        const updated = [...(formData.homeImages || [])];
        updated[index] = file;
        setFormData(prev => ({ ...prev, homeImages: updated }));
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleImageChange(index, files[0]);
        }
        setDragIndex(null);
    };

    const handleNext = () => {
        const uploadedCount = (formData.homeImages || []).filter(Boolean).length;
        if (uploadedCount < 2) {
            alert(t.alert);
            return;
        }
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <p className="mb-4 text-sm text-gray-700 whitespace-pre-line">{t.instruction}</p>
                <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">{t.note}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className={`border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center ${dragIndex === index ? 'bg-purple-50' : ''}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setDragIndex(index)}
                            onDragLeave={() => setDragIndex(null)}
                            onDrop={(e) => handleDrop(index, e)}
                        >
                            <div className="text-xs font-semibold mb-2">{index + 1}. {index === 0 ? "Main" : ""}</div>
                            {formData.homeImages && formData.homeImages[index] ? (
                                <img
                                    src={URL.createObjectURL(formData.homeImages[index])}
                                    alt={`Upload ${index + 1}`}
                                    className="h-32 w-32 object-cover rounded mb-2"
                                />
                            ) : (
                                <label className="cursor-pointer text-gray-500 hover:text-purple-500">
                                    <div className="text-4xl">📷</div>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ {t.back}</button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">{t.continue} ▶</button>
                </div>

                <div>
                    <button
                        onClick={next}
                        className="text-xs text-gray-400 underline"
                    >
                        {t.skip}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step3PetImages;
