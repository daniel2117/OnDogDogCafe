import React, { useState, useEffect } from "react";
import { contentApi, reservationApi } from "../../services/api";

const Step1Start = ({ formData, setFormData, next, lang, toggleLang }) => {
    const [email, setEmail] = useState(formData.email || "");
    const [firstName, setFirstName] = useState(formData.firstName || "");
    const [lastName, setLastName] = useState(formData.lastName || "");
    const [code, setCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [termsText, setTermsText] = useState("");
    const [policyText, setPolicyText] = useState("");

    const sendVerification = async () => {
        setLoading(true);
        try {
            await reservationApi.verifyEmail(email);
            alert(lang === 'zh' ? '驗證碼已發送到您的電子郵件。' : "Verification code sent to your email.");
        } catch (e) {
            alert(e.message || lang === 'zh' ? '未能發送驗證碼。' : "Failed to send verification code.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        console.log("Verifying code:", code);
        setLoading(true);
        try {
            await reservationApi.verifyCode(email, code);
            setEmailVerified(true);
            alert("Email verified successfully.");
        } catch (e) {
            alert(e.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        console.log("Next step with:", { email, firstName, lastName, emailVerified, agree });
        if (!emailVerified || !firstName || !lastName || !agree) {
            alert("Please complete all fields and verify your email.");
            return;
        }
        setFormData(prev => ({ ...prev, email, firstName, lastName }));
        next();
    };

    useEffect(() => {
        const fetchTermsAndPolicy = async () => {
            console.log("Fetching terms and privacy for language:", lang);
            const languageCode = lang === 'zh' ? 'zh' : 'en';
            try {
                const terms = await contentApi.getTerms(languageCode);
                const privacy = await contentApi.getPrivacy(languageCode);
                setTermsText(terms?.content || "");
                setPolicyText(privacy?.content || "");
            } catch (error) {
                console.error("Failed to fetch terms and privacy policy:", error);
            }
        }
        fetchTermsAndPolicy();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
            <div className="w-full max-w-2xl border rounded-lg shadow p-6">

                <div className="text-sm text-gray-700">
                    <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">{lang === 'zh' ? '電子郵件/用戶名' : "Email/Username"}</label>
                        <div className="text-purple-600">{emailVerified ? email : lang === 'zh' ? '尚未提供' : 'Not provided yet'}</div>
                    </div>

                    <div className="mb-1">
                        <label className="block text-xs font-semibold">{lang === 'zh' ? '名字' : 'First name'}</label>
                        <div className="text-gray-700">{firstName || '—'}</div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold">{lang === 'zh' ? '姓氏' : 'Last name'}</label>
                        <div className="text-gray-700">{lastName || '—'}</div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs mb-1">{lang === 'zh' ? '請輸入您的電子郵件' : 'Enter your email'}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            disabled={emailVerified}
                        />
                        {!emailVerified && (
                            <button
                                onClick={sendVerification}
                                className="mt-2 text-xs text-purple-600 underline"
                            >
                                {lang === 'zh' ? '發送驗證碼' : 'Send Verification Code'}
                            </button>
                        )}
                    </div>

                    {!emailVerified && (
                        <div className="mb-4">
                            <label className="block text-xs mb-1">{lang === 'zh' ? '請輸入驗證碼' : 'Enter verification code'}</label>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                onClick={verifyCode}
                                className="mt-2 text-xs text-purple-600 underline"
                            >
                                {lang === 'zh' ? '驗證碼' : 'Verify Code'}
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-xs mb-1">{lang === 'zh' ? '名字' : 'First name'}</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs mb-1">{lang === 'zh' ? '姓氏' : 'Last name'}</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <label className="text-xs flex items-start gap-1 mb-6">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="mt-1"
                        />
                        <span>
                            {lang === 'zh' ? '我已閱讀並同意' : 'I have read and agree to the'}
                            <button
                                type="button"
                                onClick={() => alert(termsText)}
                                className="text-blue-600 underline mx-1"
                            >{lang === 'zh' ? '條款/隱私政策' : 'Terms/Privacy'}</button>
                        </span>
                    </label>

                    <div className="text-center space-y-4">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-purple-500 text-white px-8 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                            {lang === 'zh' ? '開始' : 'Start'}
                        </button>
                        <div>
                            <button
                                onClick={next}
                                className="text-xs text-gray-400 underline"
                            >
                                Skip verification for development →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 언어 context props 활용 버전
export default Step1Start;
