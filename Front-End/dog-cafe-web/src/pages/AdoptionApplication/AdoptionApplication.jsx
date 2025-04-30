import Step1BasicInfo from "./Step1BasicInfo";
import Step2Address from "./Step2Address";
import Step3PrimaryQuestion from "./Step3PrimaryQuestion";
import Step4Images from "./Step4Images";
import Step5Roommate from "./Step5Roommate";
import Step6OtherAnimal from "./Step6OtherAnimal";
import Step7Confirmation from "./Step7Confirmation";
import React, { useEffect, useState } from "react";
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

const AdoptionApplication = ({ lang, toggleLang }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { state } = location;
    const isModify = state?.modify || false;
    const application = state?.application || null;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        if (isModify && application) {
            // 기존 application 데이터로 formData 세팅
            setFormData({
                firstName: application.firstName || "",
                lastName: application.lastName || "",
                email: application.email || "",
                phone: application.phone || "",
                addressLine1: application.address?.line1 || "",
                addressLine2: application.address?.line2 || "",
                town: application.address?.town || "",
                garden: application.garden || "",
                homeSituation: application.homeSituation || "",
                householdSetting: application.householdSetting || "",
                activityLevel: application.activityLevel || "",
                incomeLevel: application.incomeLevel || "",
                adults: application.adults || "",
                children: application.children || "",
                youngestAge: application.youngestAge || "",
                hasVisitingChildren: application.hasVisitingChildren || "",
                hasFlatmates: application.hasFlatmates || "",
                hasOtherAnimals: application.hasOtherAnimals || "",
                neutered: application.neutered || "",
                vaccinated: application.vaccinated || "",
                allergies: application.allergies || "",
                experience: application.experience || "",
                visitingAge: application.visitingAge || "",
                otherAnimalDetails: application.otherAnimalDetails || "",
                // homeImages는 수정 화면에서는 제외 (업로드 다시 하게 할 수도 있음)
            });
        }
    }, [isModify, application]);

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
                    <h1 className="text-xl font-bold">{lang === 'zh' ? '收養申請' : 'Adoption Application'}</h1>
                    <p className="text-sm text-gray-500">
                        {isModify ? (lang === 'zh' ? '（修改模式）' : '(Modify Mode)') : `Step ${currentStep + 1} of ${steps.length}`}
                    </p>
                </div>

                <StepComponent
                    formData={formData}
                    setFormData={setFormData}
                    next={next}
                    back={back}
                    isLastStep={currentStep === steps.length - 1}
                    lang={lang}
                    toggleLang={toggleLang}
                    isModify={isModify} // 필요하면 Step 컴포넌트로 modify 여부 넘겨줄 수도 있음
                />
            </div>
        </div>
    );
};

export default AdoptionApplication;
