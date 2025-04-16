import React, { useState } from "react";
import dogCafeApi from "../../services/api";

const Step1BasicInfo = ({ formData, setFormData, next }) => {
    const [email, setEmail] = useState(formData.email || "");
    const [firstName, setFirstName] = useState(formData.firstName || "");
    const [lastName, setLastName] = useState(formData.lastName || "");
    const [code, setCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendVerification = async () => {
        setLoading(true);
        try {
            await dogCafeApi.verifyEmail(email);
            alert("Verification code sent to your email.");
        } catch (e) {
            alert(e.message || "Failed to send verification code.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        try {
            await dogCafeApi.verifyCode(email, code);
            setEmailVerified(true);
            alert("Email verified successfully.");
        } catch (e) {
            alert(e.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (!emailVerified || !firstName || !lastName || !agree) {
            alert("Please complete all fields and verify your email.");
            return;
        }
        setFormData(prev => ({ ...prev, email, firstName, lastName }));
        next();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
            <div className="w-full max-w-2xl border rounded-lg shadow p-6">
                <div className="text-sm text-gray-700">
                    <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">Email/Username</label>
                        <div className="text-purple-600">{emailVerified ? email : 'Not provided yet'}</div>
                    </div>
                    <div className="mb-1">
                        <label className="block text-xs font-semibold">First name</label>
                        <div className="text-gray-700">{firstName || '—'}</div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold">Last name</label>
                        <div className="text-gray-700">{lastName || '—'}</div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs mb-1">Enter your email</label>
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
                                Send verification code
                            </button>
                        )}
                    </div>

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

                    <label className="text-xs flex items-center mb-6">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="mr-2"
                        />
                        I have read and agree to the <a href="/terms" className="text-blue-600 underline ml-1">Terms</a> and <a href="/privacy" className="text-blue-600 underline">Privacy Policy</a>
                    </label>

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
        </div>
    );
};

export default Step1BasicInfo;