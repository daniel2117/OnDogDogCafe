import React, { useState } from 'react';

const KeyFacts = () => {
    const [facts, setFacts] = useState({});

    const options = ['Yes', 'No', 'Unknown'];

    const questions = [
        'Shots up to date',
        'Microchipped',
        'House-trained',
        'Good with Dogs',
        'Good with Cats',
        'Good with Kids',
        'Purebred',
        'Has Special Needs',
        'Has Behavioural Issues'
    ];

    const handleChange = (question, answer) => {
        setFacts({ ...facts, [question]: answer });
    };

    return (
        <div className="bg-white min-h-screen p-4 sm:p-10 flex flex-col items-center text-gray-700">
            {/* Breadcrumbs */}
            <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
                Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center justify-between w-full max-w-4xl mb-6">
                {['Start', 'Primary Questions', "Pet's Images", 'Characteristics', 'Key Facts', "Pet's Story", 'Documents', 'Confirm'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 4 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-6 mb-10 max-w-3xl w-full">
                {questions.map((question, index) => (
                    <div key={index} className="flex flex-col">
                        <label className="mb-2 font-medium text-sm">{question}</label>
                        <div className="flex gap-6">
                            {options.map((opt) => (
                                <label key={opt} className="flex items-center gap-1 text-sm">
                                    <input
                                        type="radio"
                                        name={`fact-${index}`}
                                        value={opt}
                                        checked={facts[question] === opt}
                                        onChange={() => handleChange(question, opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
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

export default KeyFacts;