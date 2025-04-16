import React, { useState } from "react";

const Step2Address = ({ formData, setFormData, next, back }) => {
    const [line1, setLine1] = useState(formData.line1 || "");
    const [line2, setLine2] = useState(formData.line2 || "");
    const [town, setTown] = useState(formData.town || "");
    const [phone, setPhone] = useState(formData.phone || "");

    const handleNext = () => {
        if (!line1 || !line2 || !town || !phone) {
            alert("Please fill in all required fields.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            line1,
            line2,
            town,
            phone
        }));
        next();
    };

    return (
        <div className="bg-white px-4 py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <p className="text-sm text-gray-600 mb-6">
                    Please note, all these details must be complete in order to apply for adopt a pet.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">Address line 1 *</label>
                        <input
                            type="text"
                            placeholder="Line1"
                            value={line1}
                            onChange={e => setLine1(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">Address line 2 *</label>
                        <input
                            type="text"
                            placeholder="Line2"
                            value={line2}
                            onChange={e => setLine2(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs mb-1">Town *</label>
                    <input
                        type="text"
                        placeholder="Town/City"
                        value={town}
                        onChange={e => setTown(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-xs mb-1">Telephone Number (either a landline or mobile number) *</label>
                    <input
                        type="text"
                        placeholder="Landline Telephone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        Continue ▶
                    </button>
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

export default Step2Address;