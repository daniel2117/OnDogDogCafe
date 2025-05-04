import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { contactApi } from "../services/api";

const ContactUs = ({ lang, toggleLang }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const texts = {
        en: {
            contact: "Contact us",
            title: "Get in touch",
            subtitle: "Do you have any inquiry? Please fill out this form\nWe will get back to you as soon as possible",
            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            phone: "Phone number",
            message: "Message",
            agree: "You agree to our friendly",
            policy: "privacy policy",
            send: "Send message",
            language: "中文",
        },
        zh: {
            contact: "聯絡我們",
            title: "與我們聯絡",
            subtitle: "有任何查詢嗎？請填寫此表格\n我們將盡快與您聯絡",
            firstName: "名字",
            lastName: "姓氏",
            email: "電子郵件",
            phone: "電話號碼",
            message: "留言內容",
            agree: "你同意我們的",
            policy: "私隱政策",
            send: "發送訊息",
            language: "English",
        }
    };

    const t = texts[lang];

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        agreed: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            message: form.message,
            phone: form.phone,
            agreed: form.agreed
        };

        try {
            await contactApi.submit(payload);
            alert("Message sent successfully!");
            setForm({ firstName: "", lastName: "", email: "", phone: "", message: "", agreed: false });
        } catch (error) {
            const errors = error.errors || [error.message || "Failed to send message."];
            alert(errors.join("\n"));
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
            {/* Header */}
            <div className="w-full flex justify-between items-center max-w-4xl mb-4">
                <Link to={`/home?lang=${lang}`}>
                    <img src="/logo.png" alt="Dog Dog Cafe" className="h-14 cursor-pointer" />
                </Link>
                <button
                    onClick={toggleLang}
                    className="border border-gray-400 rounded-md px-3 py-1 text-sm"
                >
                    {t.language}
                </button>
            </div>
            <div className="w-full max-w-xl">
                <h4 className="text-purple-600 text-sm font-semibold text-center mb-1">{t.contact}</h4>
                <h2 className="text-3xl font-bold text-center mb-2">{t.title}</h2>
                <p className="text-gray-500 text-center mb-8 whitespace-pre-line">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder={t.firstName}
                            className="border p-2 rounded w-full"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder={t.lastName}
                            className="border p-2 rounded w-full"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        name="email"
                        placeholder="you@gmail.com"
                        className="border p-2 rounded w-full"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="+852 0000-0000"
                        className="border p-2 rounded w-full"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="message"
                        placeholder={t.message}
                        rows="4"
                        className="border p-2 rounded w-full"
                        value={form.message}
                        onChange={handleChange}
                        required
                    />

                    {/* 약관 동의 */}
                    <label className="text-xs flex items-start gap-1 mb-6">
                        <input
                            type="checkbox"
                            name="agreed"
                            checked={form.agreed}
                            onChange={handleChange}
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

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                    >
                        {t.send}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ContactUs;
