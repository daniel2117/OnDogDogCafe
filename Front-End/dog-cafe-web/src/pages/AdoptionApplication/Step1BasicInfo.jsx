import React, { useState, useEffect } from "react";
import { contentApi, reservationApi } from "../../services/api";


const Step1BasicInfo = ({ lang, toggleLang, formData, setFormData, next }) => {
    const [email, setEmail] = useState(formData.email || "");
    const [firstName, setFirstName] = useState(formData.firstName || "");
    const [lastName, setLastName] = useState(formData.lastName || "");
    const [code, setCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [termsText, setTermsText] = useState(""); // State for terms content
    const [policyText, setPolicyText] = useState(""); // State for policy content

    // Send verification code to user's email
    const sendVerification = async () => {
        setLoading(true);
        try {
            await reservationApi.verifyEmail(email);
            alert("Verification code sent to your email.");
        } catch (e) {
            alert(e.message || "Failed to send verification code.");
        } finally {
            setLoading(false);
        }
    };

    // Verify the entered code
    const verifyCode = async () => {
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

    // Submit and go to next step
    const handleNext = () => {
        if (!emailVerified || !firstName || !lastName || !agree) {
            alert("Please complete all fields and verify your email.");
            return;
        }
        setFormData(prev => ({ ...prev, email, firstName, lastName }));
        next();
    };

    // Load terms and policy from API on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        // const fetchTermsAndPolicy = async () => {
        //     try {
        //         const terms = await contentApi.getTerms("en");
        //         const privacy = await contentApi.getPrivacy("en");
        //         setTermsText(terms?.content || "");
        //         setPolicyText(privacy?.content || "");
        //     } catch (error) {
        //         console.error("Failed to fetch terms and privacy policy:", error);
        //     }
        // };
        // fetchTermsAndPolicy();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
            <div className="w-full max-w-2xl border rounded-lg shadow p-6">
                <div className="text-sm text-gray-700">
                    {/* Display verified email or placeholder */}
                    <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">Email/Username</label>
                        <div className="text-purple-600">{emailVerified ? email : 'Not provided yet'}</div>
                    </div>

                    {/* Display entered names */}
                    <div className="mb-1">
                        <label className="block text-xs font-semibold">First name</label>
                        <div className="text-gray-700">{firstName || '—'}</div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold">Last name</label>
                        <div className="text-gray-700">{lastName || '—'}</div>
                    </div>

                    {/* Email input */}
                    <div className="mb-4">
                        <label className="block text-xs mb-1">Enter your email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            disabled={emailVerified}
                        />
                        {/* Send code button (if not verified) */}
                        {!emailVerified && (
                            <button
                                onClick={sendVerification}
                                className="mt-2 text-xs text-purple-600 underline"
                            >
                                Send verification code
                            </button>
                        )}
                    </div>

                    {/* Code verification */}
                    {!emailVerified && (
                        <div className="mb-4">
                            <label className="block text-xs mb-1">Enter verification code</label>
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
                                Verify Code
                            </button>
                        </div>
                    )}

                    {/* Name inputs */}
                    <div className="mb-4">
                        <label className="block text-xs mb-1">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs mb-1">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Agreement checkbox with dynamic terms text */}
                    <label className="text-xs flex items-start gap-1 mb-6">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="mt-1"
                        />
                        <span>
                            {lang === 'zh' ? '我已閱讀並同意' : 'I have read and agree to the'}
                            <a
                                href="/terms.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline mx-1"
                            >
                                {lang === 'zh' ? '條款/隱私政策' : 'Terms/Privacy'}
                            </a>
                        </span>

                    </label>

                    {/* Navigation buttons */}
                    <div className="text-center space-y-4">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-purple-500 text-white px-8 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                            Start
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
            <div className="mt-10 text-center text-sm text-gray-500">
                <p className="text-xs mt-2">©2025 by On Dog Dog Cafe.</p>
            </div>
        </div>
    );
};

export default Step1BasicInfo;