import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
        language: lang === "zh" ? "English" : "中文",
        services: {
            "Cafe Visit": lang === "zh" ? "咖啡廳探訪" : "Cafe Visit",
            "Dog Party": lang === "zh" ? "狗派對" : "Dog Party",
            "Dog Day Care": lang === "zh" ? "狗狗托育" : "Dog Day Care",
            "Swimming Pool": lang === "zh" ? "狗狗游泳池" : "Swimming Pool"
        },
        numberOfPeople: lang === "zh" ? "訪客人數" : "Number of People",
        petNameGuide: lang === "zh"
            ? "如果沒有攜帶寵物，可以選擇0。"
            : "If you are visiting without a pet, you can select 0.",
        peopleGuide: lang === "zh"
            ? "請選擇您一同來訪的人數。"
            : "Please select how many people are visiting.",
    };

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [canResend, setCanResend] = useState(false);
    const location = useLocation();
    const isModify = location.state?.modify || false;
    const reservation = location.state?.reservation || null;

    const [showSummary, setShowSummary] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [availableSlots, setAvailableSlots] = useState({});
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        petName: "",
        bringingPet: "",
        numberOfPeople: "",
        phone: "",
        message: "",
        email: "",
    });

    useEffect(() => {
        if (isModify && reservation) {
            console.log("Modify load reservation:", reservation);

            setFormData({
                name: reservation.customerInfo.name || "",
                phone: reservation.customerInfo.phone || "",
                petName: reservation.customerInfo.petName || "",
                petType: reservation.customerInfo.petType || "",
                numberOfPeople: reservation.numberOfPeople?.toString() || "",
                message: reservation.customerInfo.message || "",
                bringingPet: reservation.customerInfo.petName ? "yes" : "no",
                email: reservation.customerInfo.email || ""
            });

            setEmail(reservation.customerInfo.email || "");
            setVerified(true);
            setDate(new Date(reservation.date));
            setTime(reservation.timeSlot);
            setSelectedServices(reservation.selectedServices || []);
        }
    }, [isModify, reservation]);




    const serviceIcons = {
        "Cafe Visit": "/icons/cafe_visit.png",
        "Dog Party": "/icons/dog_cake.png",
        "Dog Day Care": "/icons/day_care.png",
        "Swimming Pool": "/icons/swimming_pool.png"
    };

    const officialHolidays = [
        "2025-01-01", "2025-01-29", "2025-01-30", "2025-01-31",
        "2025-04-04", "2025-04-18", "2025-04-19", "2025-04-21",
        "2025-05-01", "2025-05-05", "2025-05-31",
        "2025-07-01", "2025-10-01", "2025-10-07", "2025-10-29",
        "2025-12-25", "2025-12-26"
    ];

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const isBookingDateSelectable = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const day = date.getDay();
        const formatted = formatDate(date);

        if (date < today) return false;
        if (day === 1) return false;
        return true;
    };

    const getDayLabel = (date) => {
        return date.getDay() === 1 ? "Cafe Closed" : null;
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
            setAvailableSlots(res.timeSlots || {}); // 🔁 저장 포맷 변경
        } catch (err) {
            alert(err.message || "Failed to fetch availability");
        }
    };


    const getCommonSlots = () => {
        if (!selectedServices.length) return [];
        return Object.entries(availableSlots)
            .filter(([time, services]) =>
                selectedServices.every(s => services.includes(s))
            )
            .map(([time]) => time);
    };


    const handleInput = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const sendVerificationCode = async () => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        setLoading(true);
        try {
            await reservationApi.verifyEmail(email);
            alert("Verification code sent.");
            setTimer(300);
            setCanResend(false);
        } catch (err) {
            alert(err.message || "Failed to send code");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        if (!code) {
            alert("Please enter the verification code.");
            return;
        }
        setLoading(true);
        try {
            await reservationApi.verifyCode(email, code);
            setVerified(true);
            setFormData(prev => ({ ...prev, email }));
            alert("Email verified successfully!");
        } catch (err) {
            alert(err.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        console.log(formData);
        if (!formData.name || !formData.phone || !email || !verified || !date || !time || selectedServices.length === 0) {
            alert("Please complete all fields and verify your email.");
            return;
        }

        const payload = {
            customerInfo: {
                name: formData.name,
                email: formData.email || email,
                phone: formData.phone,
                petName: formData.petName,
                petType: formData.petType || "",
                message: formData.message
            },
            date: formatDate(date),
            timeSlot: time,
            selectedServices: selectedServices,
            numberOfPeople: parseInt(formData.numberOfPeople, 10),

        };


        try {
            if (isModify && reservation?.id) {
                console.log("modify payload : " + payload);
                await reservationApi.modify(reservation.id, payload);
                alert("Reservation updated successfully!");
            } else {
                await reservationApi.create(payload);
                alert("Reservation submitted successfully!");
            }
            setShowSummary(true);
        } catch (err) {
            alert(err.message || "Failed to submit reservation.");
        }
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
                    {/* Services */}
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
                                    <span>{t.services[s]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">{t.date}</h2>
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            filterDate={isBookingDateSelectable}
                            dayClassName={(date) => {
                                const label = getDayLabel(date);
                                if (label === "Public Holiday") return "text-red-500";
                                if (label === "Cafe Closed") return "text-gray-400";
                                return "";
                            }}
                            renderDayContents={(dayOfMonth, date) => {
                                const label = getDayLabel(date);
                                return label ? (
                                    <div className="relative group">
                                        <span>{dayOfMonth}</span>
                                        <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-1 rounded">
                                            {label}
                                        </div>
                                    </div>
                                ) : <span>{dayOfMonth}</span>;
                            }}
                            className="w-full border rounded p-2 mb-2"
                        />
                        <button onClick={fetchAvailability} className="bg-purple-600 text-white px-4 py-2 rounded">{t.search}</button>
                    </div>

                    {/* Time */}
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

                    {/* Form */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold">{t.name}</h2>
                        <input name="name" value={formData.name} required className="w-full border rounded p-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold">{lang === 'zh' ? "您會攜帶寵物嗎？" : "Are you bringing a pet?"}</h2>
                        <div className="flex gap-6 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="bringingPet"
                                    value="yes"
                                    checked={formData.bringingPet === "yes"}
                                    onChange={handleInput}
                                />
                                {lang === 'zh' ? "是" : "Yes"}
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="bringingPet"
                                    value="no"
                                    checked={formData.bringingPet === "no"}
                                    onChange={handleInput}
                                />
                                {lang === 'zh' ? "否" : "No"}
                            </label>
                        </div>


                        {formData.bringingPet === "yes" && (
                            <>
                                <h2 className="text-lg font-bold">{t.petName}</h2>
                                <input
                                    name="petName"
                                    value={formData.petName}
                                    onChange={handleInput}
                                    className="w-full border rounded p-2 mb-2"
                                    placeholder={lang === 'zh' ? "寵物名字" : "Pet Name"}
                                />
                                <h2 className="text-lg font-bold">{lang === 'zh' ? "寵物種類" : "Pet Type"}</h2>
                                <select
                                    name="petType"
                                    className="w-full border rounded p-2 mb-2"
                                    value={formData.petType || ""}
                                    onChange={handleInput}
                                >
                                    <option value="">{lang === 'zh' ? "請選擇" : "Please select"}</option>
                                    <option value="Dog">{lang === 'zh' ? "狗" : "Dog"}</option>
                                    <option value="Cat">{lang === 'zh' ? "貓" : "Cat"}</option>
                                    <option value="Other">{lang === 'zh' ? "其他" : "Other"}</option>
                                </select>

                            </>
                        )}


                        <h2 className="text-lg font-bold">{t.numberOfPeople}</h2>
                        <select
                            name="numberOfPeople"
                            className="w-full border rounded p-2 mb-1"
                            value={formData.numberOfPeople}
                            onChange={handleInput}
                        >
                            <option value="">{lang === 'zh' ? "請選擇" : "Please select"}</option>
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mb-6">{t.peopleGuide}</p>


                        <h2 className="text-lg font-bold">{t.phone}</h2>
                        <input name="phone" value={formData.phone} required className="w-full border rounded p-2" onChange={handleInput} />

                        <h2 className="text-lg font-bold">{t.message}</h2>
                        <textarea name="message" value={formData.message} required className="w-full border rounded p-2" onChange={handleInput} />

                        {/* Email Verification */}
                        {!verified && (
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full border rounded p-2"
                                    placeholder={t.email}
                                />
                                {timer === null && !canResend && (
                                    <button onClick={sendVerificationCode} className="text-sm text-purple-600 underline">{t.sendCode}</button>
                                )}
                                {timer !== null && timer > 0 && (
                                    <div className="text-sm text-gray-600">
                                        {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                    </div>
                                )}
                                {canResend && (
                                    <button onClick={sendVerificationCode} className="text-sm text-purple-600 underline">
                                        Resend Verification Code
                                    </button>
                                )}
                                <input
                                    type="text"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    placeholder={t.enterCode}
                                    className="w-full border rounded p-2"
                                />
                                <button onClick={verifyCode} className="bg-purple-500 text-white px-4 py-2 rounded">{t.verify}</button>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit} className="bg-purple-700 text-white px-6 py-2 rounded">{t.submit}</button>
                </>
            ) : (
                // Summary 화면
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
                        <button onClick={() => navigate(`/?lang=${lang}`)} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">{t.home}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetail;
