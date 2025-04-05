import React, { useState } from 'react';

const PrimaryQuestions = () => {
    const [formData, setFormData] = useState({
        petType: '',
        neutered: '',
        reason: '',
        holdTime: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContinue = () => {
        // Proceed to next step
        console.log(formData);
    };

    return (
        <div className="bg-white min-h-screen p-4 sm:p-10 flex flex-col items-center text-gray-700">
            {/* Progress Header */}
            <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
                Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
            </div>

            <div className="flex items-center justify-between w-full max-w-4xl mb-6">
                {['Start', 'Primary Questions', "Pet's Images", 'Characteristics', 'Key Facts', "Pet's Story", 'Documents', 'Confirm'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 1 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Form Section */}
            <div className="w-full max-w-xl">
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Are you rehoming a dog or cat?</label>
                    <label className="mr-6">
                        <input type="radio" name="petType" value="Dog" onChange={handleChange} /> Dog
                    </label>
                    <label>
                        <input type="radio" name="petType" value="Cat" onChange={handleChange} /> Cat
                    </label>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">Is your pet spayed or neutered?</label>
                    <label className="mr-6">
                        <input type="radio" name="neutered" value="Yes" onChange={handleChange} /> Yes
                    </label>
                    <label>
                        <input type="radio" name="neutered" value="No" onChange={handleChange} /> No
                    </label>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">Why do you need to rehome your pet?</label>
                    <select name="reason" value={formData.reason} onChange={handleChange} className="w-full border rounded p-2">
                        <option value="">Pick a value</option>
                        <option value="Moving">Moving</option>
                        <option value="Financial Issues">Financial Issues</option>
                        <option value="Personal Reasons">Personal Reasons</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium">How long are you able to keep your pet while we help find a suitable new home?</label>
                    <select name="holdTime" value={formData.holdTime} onChange={handleChange} className="w-full border rounded p-2">
                        <option value="">Please Select</option>
                        <option value="1 week">1 week</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="Longer">Longer</option>
                    </select>
                </div>

                <div className="flex justify-between mt-10">
                    <button className="border px-4 py-2 rounded text-purple-600">&lt; Back</button>
                    <button onClick={handleContinue} className="bg-purple-600 text-white px-6 py-2 rounded">Continue &gt;</button>
                </div>
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

export default PrimaryQuestions;
