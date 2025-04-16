import Step1BasicInfo from "./Step1BasicInfo";
import Step2Address from "./Step2Address";
import Step3PrimaryQuestion from "./Step3PrimaryQuestion";
import Step4Images from "./Step4Images";
import Step5Roommate from "./Step5Roommate";
import Step6OtherAnimal from "./Step6OtherAnimal";
import Step7Confirmation from "./Step7Confirmation";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const steps = [
    Step1BasicInfo,
    Step2Address,
    Step3PrimaryQuestion,
    Step4Images,
    Step5Roommate,
    Step6OtherAnimal,
    Step7Confirmation,
];

const AdoptionApplication = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const lang = queryParams.get("lang") || "en";

    const StepComponent = steps[currentStep];

    const next = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="min-h-screen bg-white px-6 py-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                        <img src="/logo.png" alt="logo" className="h-16" />
                    </div>
                    <button
                        onClick={() => navigate(`/contactus?lang=${lang}`)}
                        className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        Contact Us
                    </button>
                </div>

                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold">Adoption Application</h1>
                    <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
                </div>

                <StepComponent
                    formData={formData}
                    setFormData={setFormData}
                    next={next}
                    back={back}
                    isLastStep={currentStep === steps.length - 1}
                />
            </div>
        </div>
    );
};

export default AdoptionApplication;