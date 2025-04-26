import React, { useState } from "react";
import { rehomingApi } from "../../services/api";

const Step7Documents = ({ formData, setFormData, next, back, lang }) => {
    const [dragIndex, setDragIndex] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleImageChange = (index, file) => {
        if (file.size > 5 * 1024 * 1024) {
            alert(lang === 'zh' ? "檔案大小不能超過 5MB。" : "File size must not exceed 5MB.");
            return;
        }
        const updated = [...(formData.documents || [])];
        updated[index] = file;
        setFormData(prev => ({ ...prev, documents: updated }));
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleImageChange(index, files[0]);
        }
        setDragIndex(null);
    };

    const uploadAll = async () => {
        const files = (formData.documents || []).filter(Boolean);
        if (files.length === 0) return alert(lang === 'zh' ? "請至少上傳一份文件。" : "Please upload at least one document.");

        const form = new FormData();
        files.forEach(file => form.append("documents", file));

        try {
            const result = await rehomingApi.uploadDocuments(form);
            console.log("Upload success:", result);
            const urls = (result || []).map(file => file.url);
            setFormData(prev => ({ ...prev, uploadedDocuments: urls }));
            setUploaded(true);
            alert("Upload success");

        } catch (err) {
            console.error("Upload failed:", err);
            alert(lang === 'zh' ? "文件上傳失敗" : "Failed to upload documents");
        }
    };

    const handleNext = () => {
        if (!uploaded) {
            alert("Please upload your images first.");
            return;
        }
        next();
    };

    const t = {
        instruction: lang === 'zh'
            ? "這些資料僅供完成送養流程後提供給領養者。我們建議您遮蓋文件上的個人資料。"
            : "This will never be visible to the public and will only be shared to the adopter when you complete Rehome Process. For your safety, we recommend you to black out any personal information on any documents.",
        uploadGuide: lang === 'zh'
            ? "如有疫苗接種記錄、結紮或晶片證明，請在此上傳"
            : "If you have any vaccine history, proof of spay or neuter, and/or microchip info, please upload below.",
        format: lang === 'zh'
            ? "圖片格式應為 (.jpg, .png, .jpeg)。最大檔案大小為 5MB。"
            : "The image format should be (.jpg, .png, .jpeg). Max file size is 5MB.",
        back: lang === 'zh' ? '返回' : 'Back',
        continue: lang === 'zh' ? '繼續' : 'Continue',
        upload: lang === 'zh' ? '上傳文件' : 'Upload Documents'
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <p className="mb-4 text-sm text-gray-700">{t.instruction}</p>
                <p className="mb-2 text-sm text-gray-700">{t.uploadGuide}</p>
                <p className="text-sm text-gray-500 mb-6">{t.format}</p>

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
                            {formData.documents && formData.documents[index] ? (
                                <img
                                    src={URL.createObjectURL(formData.documents[index])}
                                    alt={`Document ${index + 1}`}
                                    className="h-32 w-32 object-cover rounded mb-2"
                                />
                            ) : (
                                <label className="cursor-pointer text-gray-500 hover:text-purple-500">
                                    <div className="text-4xl">🗎➕</div>
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
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ Back
                    </button>

                    {!uploaded && ( // ✨ 업로드 성공하면 Upload 버튼 아예 숨기기
                        <button
                            onClick={uploadAll}
                            disabled={uploading}
                            className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        Continue ▶
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step7Documents;
