import Step1Start from "./Step1Start";
import Step2PrimaryQuestion from "./Step2PrimaryQuestion";
import Step3PetImage from "./Step3PetImage";
import Step4Characteristics from "./Step4Characteristics";
import Step5KeyFact from "./Step5KeyFact";
import Step6PetStory from "./Step6PetStory";
import Step7Document from "./Step7Document";
import Step8Confirm from "./Step8Confirm";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
    Step1Start,
    Step2PrimaryQuestion,
    Step3PetImage,
    Step4Characteristics,
    Step5KeyFact,
    Step6PetStory,
    Step7Document,
    Step8Confirm,
];

const RehomeApplication = ({ lang, toggleLang }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


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
                        onClick={toggleLang}
                        className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {lang === 'zh' ? 'English' : '中文'}
                    </button>
                </div>

                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold">{lang === 'zh' ? '重新安置申請' : 'Rehoming Application'}</h1>
                    <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
                </div>

                <StepComponent
                    formData={formData}
                    setFormData={setFormData}
                    next={next}
                    back={back}
                    isLastStep={currentStep === steps.length - 1}
                    lang={lang}
                    toggleLang={toggleLang}
                />
            </div>
        </div>
    );
};

export default RehomeApplication;
