import React, { useState, useEffect } from "react";
import { contentApi, reservationApi } from "../../services/api";
import { useLocation } from "react-router-dom";

const Step1BasicInfo = ({ lang, toggleLang, formData, setFormData, next }) => {
    const location = useLocation();
    const isModify = location.state?.modify || false;

    const [email, setEmail] = useState(formData.email || "");
    const [firstName, setFirstName] = useState(formData.firstName || "");
    const [lastName, setLastName] = useState(formData.lastName || "");
    const [code, setCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(isModify ? true : false); // ⭐ modify 모드면 바로 true
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const [timer, setTimer] = useState(null);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        if (formData.email && !email) setEmail(formData.email);
        if (formData.firstName && !firstName) setFirstName(formData.firstName);
        if (formData.lastName && !lastName) setLastName(formData.lastName);
    }, [formData]);

    useEffect(() => {
        let interval;
        if (timer !== null && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const sendVerification = async () => {
        setLoading(true);
        try {
            await reservationApi.verifyEmail(email);
            alert(lang === 'zh' ? '驗證碼已發送到您的電子郵件。' : "Verification code sent to your email.");
            setTimer(300);
            setCanResend(false);
        } catch (e) {
            alert(e.message || (lang === 'zh' ? '未能發送驗證碼。' : "Failed to send verification code."));
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
        if ((!emailVerified && !isModify) || !firstName || !lastName || !agree) {
            alert("Please complete all fields and verify your email.");
            return;
        }
        setFormData(prev => ({ ...prev, email, firstName, lastName }));
        next();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
            <div className="w-full max-w-2xl border rounded-lg shadow p-6">

                <div className="text-sm text-gray-700">
                    {/* 이메일 표시 */}
                    <div className="mb-2">
                        <label className="block text-xs font-semibold mb-1">{lang === 'zh' ? '電子郵件/用戶名' : "Email/Username"}</label>
                        <div className="text-purple-600">{email || (lang === 'zh' ? '尚未提供' : 'Not provided yet')}</div>
                    </div>

                    {/* modify 모드가 아니면 이메일 입력 + 인증 */}
                    {!isModify && (
                        <>
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
                                    <>
                                        <div className="flex items-center gap-2 mt-2">
                                            {timer === null && (
                                                <button
                                                    onClick={sendVerification}
                                                    className="text-xs text-purple-600 underline"
                                                    disabled={loading}
                                                >
                                                    {lang === 'zh' ? '發送驗證碼' : 'Send Verification Code'}
                                                </button>
                                            )}
                                            {timer !== null && timer > 0 && (
                                                <div className="text-xs text-gray-500">{formatTime(timer)}</div>
                                            )}
                                            {canResend && (
                                                <button
                                                    onClick={sendVerification}
                                                    className="text-xs text-purple-600 underline"
                                                    disabled={loading}
                                                >
                                                    {lang === 'zh' ? '重新發送驗證碼' : 'Resend Verification Code'}
                                                </button>
                                            )}
                                        </div>
                                    </>
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
                                        disabled={loading}
                                    >
                                        {lang === 'zh' ? '驗證碼' : 'Verify Code'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* 이름 입력 */}
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

                    {/* 약관 동의 */}
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

                    <div className="text-center space-y-4">
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-purple-500 text-white px-8 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                            {lang === 'zh' ? '開始' : 'Start'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1BasicInfo;
