import React, { useState } from 'react';

const DocumentUpload = () => {
    const [documents, setDocuments] = useState([null, null, null, null]);

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const updated = [...documents];
        updated[index] = URL.createObjectURL(file);
        setDocuments(updated);
    };

    return (
        <div className="bg-white min-h-screen p-4 sm:p-10 flex flex-col items-center text-gray-700">
            {/* Breadcrumbs */}
            <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
                Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center justify-between w-full max-w-4xl mb-6">
                {["Start", "Primary Questions", "Pet's Images", "Characteristics", "Key Facts", "Pet's Story", "Documents", "Confirm"].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 6 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            <div className="w-full max-w-xl text-sm text-gray-600 mb-4">
                <p className="font-semibold">This will never be visible to the public and will be only shared to the adopter when you complete Rehome Process. For your safety, we recommend you to black out any personal information on any documents.</p>
                <p className="mt-2">If you have any vaccine history, proof of spay or neuter, and/or microchip info, please upload below.</p>
                <ul className="list-disc ml-6 mt-2">
                    <li>The image format should be (.jpg, .png, .jpeg).</li>
                    <li>The image measurements must be square in shape, with dimensions of 600 × 600 pixels.</li>
                    <li>The maximum & minimum image size is 1024 and 240 KB.</li>
                </ul>
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-xl mb-10">
                {documents.map((doc, index) => (
                    <label key={index} className="w-full h-40 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                        {doc ? (
                            <img src={doc} alt={`Upload ${index + 1}`} className="object-cover w-full h-full rounded" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <span className="text-3xl">📝</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, index)}
                        />
                    </label>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between w-full max-w-xl">
                <button className="border px-4 py-2 rounded text-purple-600">&lt; Back</button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded">Continue &gt;</button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-10">
                <button className="mb-2 border px-4 py-1 rounded">Book Now</button>
                <div>6613 2128</div>
                <div>何文田梭道3號1樓<br />1/F, 3 Soares Avenue</div>
                <div className="mt-2">©2025 by On Dog Dog Cafe.</div>
            </div>
        </div>
    );
};

export default DocumentUpload;