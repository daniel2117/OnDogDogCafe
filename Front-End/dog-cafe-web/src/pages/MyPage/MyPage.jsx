import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reservationApi } from "../../services/api";

const MyPage = ({ lang, toggleLang }) => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const t = {
        title: lang === "zh" ? "驗證您的電子郵件" : "Verify Your Email",
        email: lang === "zh" ? "您的電子郵件" : "Your Email",
        code: lang === "zh" ? "驗證碼" : "Verification Code",
        send: lang === "zh" ? "發送驗證碼" : "Send Verification Code",
        resend: lang === "zh" ? "重新發送" : "Resend",
        verify: lang === "zh" ? "驗證" : "Verify",
        verifying: lang === "zh" ? "驗證中..." : "Verifying...",
        success: lang === "zh" ? "您的電子郵件已成功驗證。" : "Your email has been verified.",
        slogan: lang === "zh"
            ? "驗證後，您可以查看預約狀態、查看領養申請進度，或留下寶貴的意見！"
            : "Verify your email to check your reservation status, track your applications, or leave feedback!",
        language: lang === "zh" ? "English" : "中文",
    };

    const sendCode = async () => {
        if (!email) return alert("Please enter your email.");
        try {
            await reservationApi.verifyEmail(email);
            setSent(true);
            setCountdown(60);
            alert("Verification code sent to your email.");
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            alert(err.message || "Failed to send code");
        }
    };

    const handleVerify = async () => {
        if (!email || !code) return alert("Please enter both email and verification code.");
        try {
            setLoading(true);
            await reservationApi.verifyCode(email, code);
            setVerified(true);
            alert("Email verified successfully!");
        } catch (err) {
            alert(err.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                    <img src="/logo.png" alt="logo" className="h-14" />
                </div>
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {t.language}
                </button>
            </div>

            <div className="w-full max-w-2xl text-center mb-8">
                <h2 className="text-2xl font-bold mb-3">{t.title}</h2>
                <p className="text-gray-600 mb-4">{t.slogan}</p>
                <img src="/images/home.webp" alt="My Page Visual" className="w-48 mx-auto mb-4" />
            </div>

            <div className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">{t.email}<span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <button
                            onClick={sendCode}
                            disabled={countdown > 0}
                            className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                        >
                            {countdown > 0 ? `${countdown}s` : sent ? t.resend : t.send}
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">{t.code}<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                >
                    {loading ? t.verifying : t.verify}
                </button>

                {verified && (
                    <div className="mt-4 text-green-600 font-semibold">{t.success}</div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
