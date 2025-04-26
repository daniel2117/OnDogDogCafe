import React, { useEffect, useState } from "react";

const Step6OtherAnimal = ({ formData, setFormData, next, back }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const [allergies, setAllergies] = useState(formData.allergies || "");
    const [hasOtherAnimals, setHasOtherAnimals] = useState(formData.hasOtherAnimals || "");
    const [otherAnimalDetails, setOtherAnimalDetails] = useState(formData.otherAnimalDetails || "");
    const [neutered, setNeutered] = useState(formData.neutered || "n/a");
    const [vaccinated, setVaccinated] = useState(formData.vaccinated || "n/a");
    const [experience, setExperience] = useState(formData.experience || "");

    const handleNext = () => {
        if (!allergies || hasOtherAnimals === "") {
            alert("Please complete all required fields.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            allergies,
            hasOtherAnimals,
            otherAnimalDetails,
            neutered,
            vaccinated,
            experience
        }));
        next();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">
            <div className="w-full max-w-3xl">
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Does anyone in the household have any allergies to pets? *</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">Are there any other animals at your home? *</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="otheranimals" value="yes" checked={hasOtherAnimals === "yes"} onChange={() => setHasOtherAnimals("yes")} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="otheranimals" value="no" checked={hasOtherAnimals === "no"} onChange={() => setHasOtherAnimals("no")} /> No
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">If yes, please state their species, age and gender</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={otherAnimalDetails}
                        onChange={e => setOtherAnimalDetails(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">If yes, are they neutered? *</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="neutered" value="yes" checked={neutered === "yes"} onChange={() => setNeutered("yes")} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="neutered" value="no" checked={neutered === "no"} onChange={() => setNeutered("no")} /> No
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="neutered" value="n/a" checked={neutered === "n/a"} onChange={() => setNeutered("n/a")} /> Not Applicable
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">If yes, have they been vaccinated in the last 12 months? *</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="vaccinated" value="yes" checked={vaccinated === "yes"} onChange={() => setVaccinated("yes")} /> Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="vaccinated" value="no" checked={vaccinated === "no"} onChange={() => setVaccinated("no")} /> No
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="vaccinated" value="n/a" checked={vaccinated === "n/a"} onChange={() => setVaccinated("n/a")} /> Not Applicable
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium">Please describe your experience of any previous pet ownership and tell us about the type of home you plan to offer your new pet</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={experience}
                        onChange={e => setExperience(e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <button onClick={back} className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50">◀ Back</button>
                    <button onClick={handleNext} className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">Submit ▶</button>
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

export default Step6OtherAnimal;
