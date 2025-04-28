import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adoptionApi } from "../../services/api";

const Step7Confirmation = ({ formData, back }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const handleApply = async () => {
        setSubmitting(true);
        try {
            console.log("Raw formData:", formData);

            const body = {
                email: formData.email || "",
                firstName: formData.firstName || "",
                lastName: formData.lastName || "",
                phone: formData.phone || "",
                address: {
                    line1: formData.line1 || "",
                    line2: formData.line2 || "",
                    town: formData.town || ""
                },
                garden: formData.garden || "",
                homeSituation: formData.homeSituation || "",
                householdSetting: formData.householdSetting || "",
                activityLevel: formData.activityLevel || "",
                incomeLevel: formData.incomeLevel || "",
                homeImages: (formData.homeImages || []).map(img => img.url || img) || [],
                adults: formData.adults || "",
                children: formData.children || "",
                youngestAge: formData.youngestAge || "",
                hasVisitingChildren: formData.hasVisitingChildren || "",
                hasFlatmates: formData.hasFlatmates || "",
                hasOtherAnimals: formData.hasOtherAnimals || "",
                neutered: formData.neutered || "",
                vaccinated: formData.vaccinated || ""
            };



            console.log("Formatted body for API:", body);

            const response = await adoptionApi.apply(body);
            console.log("Adoption application submitted:", response);
            alert("Your adoption application has been submitted successfully!");
            navigate(`/`);
        } catch (error) {
            console.error("Failed to submit adoption application:", error);
            alert("Failed to submit adoption application. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-2xl font-bold mb-4">Confirm Your Application</h1>
                <p className="text-gray-700 mb-6">
                    Please review your application before submitting.
                </p>

                {/* Summary */}
                <div className="bg-gray-50 border rounded p-6 text-left text-sm w-full mb-8">
                    <h2 className="text-base font-semibold mb-4 text-purple-700">Submission Summary</h2>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Address:</strong> {formData.line1} {formData.line2}, {formData.town}</p>
                        <p><strong>Garden:</strong> {formData.garden}</p>
                        <p><strong>Home Situation:</strong> {formData.homeSituation}</p>
                        <p><strong>Household Setting:</strong> {formData.householdSetting}</p>
                        <p><strong>Activity Level:</strong> {formData.activityLevel}</p>
                        <p><strong>Income Level:</strong> {formData.incomeLevel}</p>
                        <p><strong>Adults:</strong> {formData.adults}</p>
                        <p><strong>Children:</strong> {formData.children} (Youngest: {formData.youngestAge} years old)</p>
                        <p><strong>Has Visiting Children:</strong> {formData.hasVisitingChildren}</p>
                        <p><strong>Visiting Child Age Group:</strong> {formData.visitingAge}</p>
                        <p><strong>Has Flatmates:</strong> {formData.hasFlatmates}</p>
                        <p><strong>Allergies:</strong> {formData.allergies}</p>
                        <p><strong>Has Other Animals:</strong> {formData.hasOtherAnimals}</p>
                        <p><strong>Other Animal Details:</strong> {formData.otherAnimalDetails}</p>
                        <p><strong>Neutered:</strong> {formData.neutered}</p>
                        <p><strong>Vaccinated:</strong> {formData.vaccinated}</p>
                        <p><strong>Experience with Animals:</strong> {formData.experience}</p>
                    </div>

                    {/* Home Images Preview */}
                    {formData.homeImages && formData.homeImages.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold mb-2">Uploaded Home Images:</h3>
                            <div className="flex flex-wrap gap-4">
                                {formData.homeImages.map((img, idx) => (
                                    img && (img.file || img.url) ? (
                                        <img
                                            key={idx}
                                            src={img.file ? URL.createObjectURL(img.file) : img.url}
                                            alt={`home-${idx}`}
                                            className="h-24 w-24 object-cover rounded border"
                                        />
                                    ) : (
                                        <div
                                            key={idx}
                                            className="h-24 w-24 flex items-center justify-center border rounded text-gray-400 text-xs"
                                        >
                                            No Image
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Buttons */}
                <div className="flex justify-between w-full">
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ Back
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={submitting}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Apply ▶"}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-10">
                    <p>6613 2128</p>
                    <p className="mt-1">何文田梭椏道3號1樓<br />1/F, 3 Soares Avenue</p>
                    <p className="text-xs mt-2">©2025 by On Dog Dog Cafe.</p>
                </div>
            </div>
        </div>
    );
};

export default Step7Confirmation;
