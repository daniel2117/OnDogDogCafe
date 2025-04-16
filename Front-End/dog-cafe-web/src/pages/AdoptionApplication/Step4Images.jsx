import React, { useState } from "react";

const Step4Images = ({ formData, setFormData, next, back }) => {
    const [dragIndex, setDragIndex] = useState(null);

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
            alert("Please upload at least 2 images.");
            return;
        }
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <p className="mb-4 text-sm text-gray-700">
                    Please add 4 photos of your home and any outside space as it helps the pet's current owner to visualize the home you are offering. <br />
                    (A minimum of 2 photos are required but uploading 4 is better!)
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    The image format should be (.jpg, .png, .jpeg).<br />
                    The image measurements must be square in shape, with dimensions of 600 × 600 pixels.<br />
                    The maximum & minimum image size is 1024 and 240 KB.
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

export default Step4Images;