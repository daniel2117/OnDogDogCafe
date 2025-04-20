import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dogCafeApi from "../../services/api";

const Step7Confirmation = ({ formData }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const submitAdoptionApplication = async () => {
            try {
                const response = await dogCafeApi.applyForAdoption(formData);
                console.log("Adoption application submitted:", response);
                alert("Your adoption application has been submitted successfully!");
            } catch (error) {
                console.error("Failed to submit adoption application:", error);
                alert("Failed to submit adoption application. Please try again later.");
            }
        };

        submitAdoptionApplication();
    }, [formData]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-2xl font-bold mb-4">Thanks For Submitting</h1>
                <p className="text-gray-700 mb-6">
                    The pet’s current owner will be sent a link to your profile when your application has been approved by Furry Friends.
                </p>
                <img src="/images/confirm_illustration.png" alt="confirmation" className="w-48 mx-auto mb-8" />

                <button
                    onClick={() => navigate("/profile")}
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                >
                    Go To My Profile
                </button>

                <div className="mt-12 text-left text-sm bg-gray-50 border rounded p-4">
                    <h2 className="text-base font-semibold mb-2 text-purple-700">Submission Summary</h2>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Phone:</strong> {formData.address?.phone}</p>
                    <p><strong>Town:</strong> {formData.address?.town}</p>
                    <p><strong>Has Garden:</strong> {formData.environment?.hasGarden ? 'Yes' : 'No'}</p>
                    <p><strong>Living Situation:</strong> {formData.environment?.homeSituation}</p>
                    <p><strong>Flatmates:</strong> {formData.roommates?.hasFlatmates ? 'Yes' : 'No'}</p>
                    <p><strong>Other Animals:</strong> {formData.otherAnimals?.hasOtherAnimals ? 'Yes' : 'No'}</p>
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

export default Step7Confirmation;
