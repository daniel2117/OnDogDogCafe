import React, { useState } from 'react';

const Characteristics = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '0',
        size: '',
        gender: '',
        breed: '',
        color: 'All',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col items-center text-gray-700">
            {/* Breadcrumbs */}
            <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
                Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center justify-between w-full max-w-4xl mb-6">
                {['Start', 'Primary Questions', "Pet's Images", 'Characteristics', 'Key Facts', "Pet's Story", 'Documents', 'Confirm'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${i === 3 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
                        <div className="mt-1 text-[10px] w-16">{step}</div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <form className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                    <label className="block text-sm font-medium mb-1">Pet's Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    <p className="text-xs text-gray-500 mt-1">If your pet is a puppy then add their age as 0</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Age (Years) *</label>
                    <select name="age" value={formData.age} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        {[...Array(21).keys()].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Size</label>
                    <select name="size" value={formData.size} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option>Please select</option>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option>Please select</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Breed(s) *</label>
                    <select name="breed" value={formData.breed} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option>Pick a value</option>
                        <option>Labrador</option>
                        <option>Shiba Inu</option>
                        <option>Poodle</option>
                        <option>Corgi</option>
                        <option>Golden Retriever</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Colors *</label>
                    <select name="color" value={formData.color} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option>All</option>
                        <option>White</option>
                        <option>Black</option>
                        <option>Brown</option>
                        <option>Golden</option>
                    </select>
                </div>
            </form>

            {/* Navigation */}
            <div className="flex justify-between w-full max-w-3xl">
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

export default Characteristics;
