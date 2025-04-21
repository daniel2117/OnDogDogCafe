import React, { useState } from "react";
import { rehomingApi } from "../../services/api";

const Step3PetImages = ({ formData, setFormData, next, back }) => {
    const [dragIndex, setDragIndex] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleImageChange = async (index, file) => {
        const updated = [...(formData.photos || [])];
        updated[index] = file;
        setFormData(prev => ({ ...prev, photos: updated }));
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
        const files = (formData.photos || []).filter(Boolean);
        if (files.length < 2) {
            alert("Please upload at least 2 images before submitting.");
            return;
        }

        const tooLarge = files.find(f => f.size > 5 * 1024 * 1024);
        if (tooLarge) {
            alert("Each image must be under 5MB.");
            return;
        }

        const formDataToSend = new FormData();
        files.forEach(file => formDataToSend.append("photos", file));

        setUploading(true);
        try {
            const res = await rehomingApi.uploadPhoto(formDataToSend);
            const urls = res.map(item => item.url);
            setFormData(prev => ({ ...prev, uploadedPhotos: urls }));
            setUploaded(true);
            alert("Upload success");

        } catch (err) {
            console.error("Upload failed:", err);
            alert(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleNext = () => {
        if (!uploaded) {
            alert("Please upload your images first.");
            return;
        }
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <p className="mb-4 text-sm text-gray-700">
                    Please add 4 photos of your pet. <br />
                    (A minimum of 2 photos are required but uploading 4 is better!)
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    The image format should be (.jpg, .png, .jpeg).<br />
                    The image measurements must be square in shape, with dimensions of 600 × 600 pixels.<br />
                    The maximum image size is 5MB.
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
                            <div className="text-xs font-semibold mb-2">{index + 1}. {index === 0 ? "Main" : ""}</div>
                            {formData.photos && formData.photos[index] ? (
                                <img
                                    src={URL.createObjectURL(formData.photos[index])}
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
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ Back</button>

                    <button
                        onClick={uploadAll}
                        disabled={uploading}
                        className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Upload
                    </button>
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

export default Step3PetImages;
