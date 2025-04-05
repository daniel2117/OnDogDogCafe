import React, { useState } from 'react';

const RehomeConfirm = () => {
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
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 7 ? 'bg-green-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Confirmation Message */}
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Thanks for submitting !</h2>
                <p className="text-gray-600 mb-2">We’ll be in touch once we’ve reviewed your pet’s profile.</p>
                <p className="text-gray-600">We want to make sure we give you the best chance of finding the right home for your pet.</p>

                <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded text-sm hover:bg-purple-700">
                    Go To My Profile
                </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 mt-20">
                <button className="mb-2 border px-4 py-1 rounded">Book Now</button>
                <div>6613 2128</div>
                <div>何文田梭道3號1樓<br />1/F, 3 Soares Avenue</div>
                <div className="mt-2">©2025 by On Dog Dog Cafe.</div>
            </div>
        </div>
    );
};

export default RehomeConfirm;
