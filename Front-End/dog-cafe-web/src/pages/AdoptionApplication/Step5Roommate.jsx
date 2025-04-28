import React, { useEffect, useState } from "react";

const Step5Roommate = ({ formData, setFormData, next, back }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const [adults, setAdults] = useState(formData.adults || "0");
    const [children, setChildren] = useState(formData.children || "0");
    const [youngestAge, setYoungestAge] = useState(formData.youngestAge || "");
    const [hasVisitingChildren, setHasVisitingChildren] = useState(formData.hasVisitingChildren || "");
    const [visitingAge, setVisitingAge] = useState(formData.visitingAge || "");
    const [hasFlatmates, setHasFlatmates] = useState(formData.hasFlatmates || "");

    const handleNext = () => {
        if (!adults || !children || (hasVisitingChildren === "" || hasFlatmates === "")) {
            alert("Please complete all required fields.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            adults,
            children,
            youngestAge,
            hasVisitingChildren,
            visitingAge,
            hasFlatmates
        }));
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Number of adults</label>
                        <select className="w-full border p-2 rounded" value={adults} onChange={e => setAdults(e.target.value)}>
                            {Array.from({ length: 6 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">At least one adult must be living in your household</p>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Number of children *</label>
                        <select className="w-full border p-2 rounded" value={children} onChange={e => setChildren(e.target.value)}>
                            {Array.from({ length: 6 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Age of youngest children</label>
                        <select className="w-full border p-2 rounded" value={youngestAge} onChange={e => setYoungestAge(e.target.value)}>
                            <option value="">Pick a value</option>
                            {[...Array(18)].map((_, i) => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Any visiting children?</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="visiting" value="yes" checked={hasVisitingChildren === "yes"} onChange={() => setHasVisitingChildren("yes")} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="visiting" value="no" checked={hasVisitingChildren === "no"} onChange={() => setHasVisitingChildren("no")} /> No
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm">Ages of visiting children</label>
                    <select className="w-full border p-2 rounded" value={visitingAge} onChange={e => setVisitingAge(e.target.value)}>
                        <option value="">Please Select</option>
                        <option value="toddler">Toddler (0-4)</option>
                        <option value="child">Child (5-12)</option>
                        <option value="teen">Teen (13-17)</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium">Do you have any flatmates or lodgers?</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="flatmate" value="yes" checked={hasFlatmates === "yes"} onChange={() => setHasFlatmates("yes")} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="flatmate" value="no" checked={hasFlatmates === "no"} onChange={() => setHasFlatmates("no")} /> No
                        </label>
                    </div>
                </div>

                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ Back</button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">Continue ▶</button>
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

export default Step5Roommate;
