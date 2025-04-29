import React, { useEffect, useState } from "react";

const Step2Address = ({ formData, setFormData, next, back, lang, toggleLang }) => {
    const [line1, setLine1] = useState(formData.addressLine1 || "");
    const [line2, setLine2] = useState(formData.addressLine2 || "");
    const [town, setTown] = useState(formData.town || "");
    const [phone, setPhone] = useState(formData.phone || "");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const handleNext = () => {
        if (!line1 || !line2 || !town || !phone) {
            alert(lang === 'zh' ? "請填寫所有必填欄位。" : "Please fill in all required fields.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            addressLine1: line1,
            addressLine2: line2,
            town,
            phone
        }));
        next();
    };

    return (
        <div className="bg-white px-4 py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <p className="text-sm text-gray-600 mb-6">
                    {lang === 'zh'
                        ? "請注意，為了申請領養寵物，這些資料必須完整填寫。"
                        : "Please note, all these details must be complete in order to apply for adopt a pet."
                    }
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">{lang === 'zh' ? "地址 第一行 *" : "Address line 1 *"}</label>
                        <input
                            type="text"
                            placeholder={lang === 'zh' ? "地址第一行" : "Line1"}
                            value={line1}
                            onChange={e => setLine1(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">{lang === 'zh' ? "地址 第二行 *" : "Address line 2 *"}</label>
                        <input
                            type="text"
                            placeholder={lang === 'zh' ? "地址第二行" : "Line2"}
                            value={line2}
                            onChange={e => setLine2(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs mb-1">{lang === 'zh' ? "城市/地區 *" : "Town *"}</label>
                    <input
                        type="text"
                        placeholder={lang === 'zh' ? "城市/地區" : "Town/City"}
                        value={town}
                        onChange={e => setTown(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-xs mb-1">{lang === 'zh' ? "電話號碼（座機或手機）*" : "Telephone Number (either a landline or mobile number) *"}</label>
                    <input
                        type="text"
                        placeholder={lang === 'zh' ? "電話號碼" : "Landline Telephone"}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={back}
                        className="border border-purple-500 text-purple-500 px-6 py-2 rounded hover:bg-purple-50"
                    >
                        ◀ {lang === 'zh' ? "返回" : "Back"}
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
                    >
                        {lang === 'zh' ? "繼續" : "Continue"} ▶
                    </button>
                </div>

                <div className="mt-10 text-center text-sm text-gray-500">
                    <p className="text-xs mt-2">©2025 by On Dog Dog Cafe.</p>
                </div>
            </div>
        </div>
    );
};

export default Step2Address;
