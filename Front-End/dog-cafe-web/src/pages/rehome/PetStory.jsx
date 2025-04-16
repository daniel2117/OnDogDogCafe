import React, { useState } from 'react';

const PetStoryPage = () => {
    const [story, setStory] = useState('');

    const handleChange = (e) => {
        setStory(e.target.value);
    };

    return (
        <div className="bg-white min-h-screen p-4 sm:p-10 flex flex-col items-center text-gray-700">
            {/* Breadcrumbs */}
            <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
                Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between w-full max-w-4xl mb-6">
                {['Start', 'Primary Questions', "Pet's Images", 'Characteristics', 'Key Facts', "Pet's Story", 'Documents', 'Confirm'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 5 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            <div className="w-full max-w-2xl text-sm text-gray-700 mb-4">
                <p>Share anything here about your pet. (Your pet profile will be visible to the public. For your safety, do not include any personal details or contact information). Include information such as:</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                    <li>Your pet's history: how long you've had them, where you got them from and why you need to rehome them</li>
                    <li>Details about who your pet has lived with, eg children and other pets</li>
                    <li>Your pet's favourite activities</li>
                    <li>A description of their personality, preferences and habits</li>
                    <li>Anything they're scared of such as fireworks, people in uniform, other animals</li>
                    <li>The type of food they eat including the brand and amount.</li>
                    <li>Allergies, health conditions, and any medications your pet takes</li>
                    <li>If you are listing a bonded pair, make sure you include details about both pets</li>
                </ul>
            </div>

            {/* Input Box */}
            <textarea
                value={story}
                onChange={handleChange}
                placeholder="Type Here ..."
                className="w-full max-w-2xl h-40 border border-gray-300 rounded p-3 resize-none mb-10"
            />

            {/* Navigation */}
            <div className="flex justify-between w-full max-w-2xl mb-10">
                <button className="border px-4 py-2 rounded text-purple-600">&lt; Back</button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded">Continue &gt;</button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500">
                <button className="mb-2 border px-4 py-1 rounded">Book Now</button>
                <div>6613 2128</div>
                <div>何文田梭道3號1樓<br />1/F, 3 Soares Avenue</div>
                <div className="mt-2">©2025 by On Dog Dog Cafe.</div>
            </div>
        </div>
    );
};

export default PetStoryPage;