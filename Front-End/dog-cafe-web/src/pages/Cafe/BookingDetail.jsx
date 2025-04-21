
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { reservationApi } from "../../services/api";

const BookingDetail = ({ lang, toggleLang }) => {
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);
    const t = {
        service: lang === "zh" ? "選擇服務" : "Choose Service",
        date: lang === "zh" ? "選擇日期" : "Select Date",
        search: lang === "zh" ? "搜尋時間" : "Search Time",
        time: lang === "zh" ? "選擇時間" : "Select Time",
        name: lang === "zh" ? "您的名字" : "Your Name",
        petName: lang === "zh" ? "寵物名字" : "Pet Name",
        phone: lang === "zh" ? "電話" : "Phone",
        email: lang === "zh" ? "電子郵件" : "Email",
        verify: lang === "zh" ? "驗證" : "Verify",
        sendCode: lang === "zh" ? "發送驗證碼" : "Send Verification Code",
        enterCode: lang === "zh" ? "輸入驗證碼" : "Enter Verification Code",
        message: lang === "zh" ? "其他說明" : "Message",
        submit: lang === "zh" ? "提交預約" : "Submit Reservation",
        success: lang === "zh" ? "預約成功提交！" : "Reservation Submitted!",
        home: lang === "zh" ? "返回首頁" : "Return to Home",
        language: lang === "zh" ? "English" : "中文"
    };

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const [selectedServices, setSelectedServices] = useState([]);
    const [availableSlots, setAvailableSlots] = useState({});
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        petName: "",
        phone: "",
        message: ""
    });

    const serviceIcons = {
        "Cafe Visit": "/icons/cafe_visit.png",
        "Dog Cake": "/icons/dog_cake.png",
        "Dog Day Care": "/icons/day_care.png",
        "Swimming Pool": "/icons/swimming_pool.png"
    };

    const toggleService = (s) => {
        setSelectedServices(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );
    };

    const fetchAvailability = async () => {
        if (!date) return alert("Please select a date.");
        try {
            const res = await reservationApi.getAvailability(date.toISOString().split("T")[0]);
            setAvailableSlots(res.availableSlots || {});
        } catch (err) {
            alert(err.message || "Failed to fetch availability");
        }
    };

    const getCommonSlots = () => {
        if (!selectedServices.length) return [];
        return selectedServices
            .map(service => availableSlots[service] || [])
            .reduce((a, b) => a.filter(t => b.includes(t)));
    };

    const handleInput = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const sendVerificationCode = async () => {
        setLoading(true);
        try {
            await reservationApi.verifyEmail(email);
            alert("Verification code sent.");
        } catch (err) {
            alert(err.message || "Failed to send code");

        } finally {
            setLoading(false);
        }
    };


    const verifyCode = async () => {
        setLoading(true);
        try {
            await reservationApi.verifyCode(email, code);
            setVerified(true);
            alert("Email verified");
        } catch (err) {
            alert(err.message || "Verification failed");

        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.petName || !formData.phone || !formData.message || !email || !verified || !date || !time || selectedServices.length === 0) {
            alert("Please complete all fields and verify your email.");
            return;
        }
        setShowSummary(true);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
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

            {!showSummary ? (
                <>
                    <div>
                        <h2 className="text-lg font-bold mb-2">{t.service}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(serviceIcons).map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleService(s)}
                                    className={`border rounded p-2 flex flex-col items-center ${selectedServices.includes(s) ? "bg-purple-500 text-white" : "bg-white"}`}
                                >
                                    <img src={serviceIcons[s]} alt={s} className="h-10 mb-1" />
                                    <span>{s}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-2">{t.date}</h2>
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            className="w-full border rounded p-2 mb-2"
                        />
                        <button onClick={fetchAvailability} className="bg-purple-600 text-white px-4 py-2 rounded">
                            {t.search}
                        </button>
                    </div>

                    {getCommonSlots().length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold mb-2">{t.time}</h2>
                            <div className="grid grid-cols-3 gap-2">
                                {getCommonSlots().map(tVal => (
                                    <button
                                        key={tVal}
                                        onClick={() => setTime(tVal)}
                                        className={`border px-2 py-1 rounded ${time === tVal ? "bg-purple-500 text-white" : "bg-white"}`}

                                    >
                                        {tVal}
                                    </button>
                                ))}
                            </div>

                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-bold mb-2">{t.name}</h2>
                        <input name="name" required className="w-full border rounded p-2 mb-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold mb-2">{t.petName}</h2>
                        <input name="petName" required className="w-full border rounded p-2 mb-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold mb-2">{t.phone}</h2>
                        <input name="phone" required className="w-full border rounded p-2 mb-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold mb-2">{t.message}</h2>
                        <textarea name="message" required className="w-full border rounded p-2 mb-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold mb-2">{t.email}</h2>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={verified}
                            className="w-full border rounded p-2 mb-2"
                        />
                        {!verified && (
                            <>
                                <button
                                    onClick={sendVerificationCode}
                                    className="text-sm text-purple-600 underline mb-2"
                                >
                                    {t.sendCode}
                                </button>
                                <input
                                    type="text"
                                    placeholder={t.enterCode}
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    className="w-full border rounded p-2 mb-2"
                                />
                                <button onClick={verifyCode} className="bg-purple-500 text-white px-4 py-2 rounded">
                                    {t.verify}
                                </button>
                            </>
                        )}
                    </div>

                    <button onClick={handleSubmit} className="bg-purple-700 text-white px-6 py-2 rounded">
                        {t.submit}
                    </button>
                </>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded p-6 shadow-md w-full max-w-md text-sm">
                        <h3 className="font-semibold text-purple-700 mb-4 text-lg">{t.success}</h3>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Pet:</strong> {formData.petName}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Message:</strong> {formData.message}</p>
                        <p><strong>Service(s):</strong> {selectedServices.join(", ")}</p>
                        <p><strong>Date:</strong> {date?.toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {time}</p>
                        <button
                            onClick={() => navigate(`/?lang=${lang}`)}
                            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            {t.home}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetail;

