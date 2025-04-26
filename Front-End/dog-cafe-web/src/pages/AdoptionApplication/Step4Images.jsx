import React, { useEffect, useState } from "react";
import { adoptionApi } from "../../services/api";

const Step4Images = ({ formData, setFormData, next, back, lang, toggleLang }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const [dragIndex, setDragIndex] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

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

    const handleUpload = async () => {
        const files = (formData.homeImages || []).filter(Boolean);
        if (files.length < 2) {
            alert(lang === 'zh' ? "請至少上傳2張圖片。" : "Please upload at least 2 images.");
            return;
        }
        const formDataToSend = new FormData();
        files.forEach(file => formDataToSend.append("files", file));

        setUploading(true);
        try {
            const res = await adoptionApi.upload(formDataToSend);
            console.log("Uploaded images:", res);
            setUploaded(true);
            alert(lang === 'zh' ? "圖片上傳成功！" : "Images uploaded successfully!");
            // 업로드된 URL을 formData에 저장하고 싶으면 여기서 추가로 처리 가능
        } catch (error) {
            console.error("Upload failed:", error);
            alert(lang === 'zh' ? "圖片上傳失敗。" : "Failed to upload images.");
        } finally {
            setUploading(false);
        }
    };

    const handleNext = () => {
        const uploadedCount = (formData.homeImages || []).filter(Boolean).length;
        if (uploadedCount < 2) {
            alert(lang === 'zh' ? "請至少上傳2張圖片。" : "Please upload at least 2 images.");
            return;
        }
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <p className="mb-4 text-sm text-gray-700">
                    {lang === 'zh'
                        ? "請上傳您的居所和任何外部空間的4張照片，以幫助寵物現任主人了解您的居住環境。"
                        : "Please add 4 photos of your home and any outside space as it helps the pet's current owner to visualize the home you are offering."
                    }<br />
                    {lang === 'zh'
                        ? "(至少需要上傳2張圖片，建議上傳4張！)"
                        : "(A minimum of 2 photos are required but uploading 4 is better!)"}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    {lang === 'zh'
                        ? "圖片格式應為 (.jpg, .png, .jpeg)。尺寸需為600×600像素的正方形，大小介於240KB到1024KB之間。"
                        : "The image format should be (.jpg, .png, .jpeg). The image measurements must be square in shape, with dimensions of 600 × 600 pixels. The maximum & minimum image size is 1024 and 240 KB."}
                </p>

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
                            <div className="text-xs font-semibold mb-2">{index + 1}. {index === 0 ? (lang === 'zh' ? "主要圖片" : "Main") : ""}</div>
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



                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ {lang === 'zh' ? "返回" : "Back"}</button>
                    {/* Upload Button */}
                    <div className="text-center mb-6">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            {uploading
                                ? (lang === 'zh' ? "上傳中..." : "Uploading...")
                                : (lang === 'zh' ? "上傳圖片" : "Upload Images")}
                        </button>
                    </div>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">{lang === 'zh' ? "繼續" : "Continue"} ▶</button>
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

export default Step4Images;
