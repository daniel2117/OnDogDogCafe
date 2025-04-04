import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const lang = queryParams.get("lang") || "en";

    const texts = {
        en: {
            numberOfPeople: "Number of People",
            chooseDate: "Choose a Date",
            pickTime: "Pick a time",
            back: "Back",
            continue: "Continue",
            requestServices: "Request Services",
            selectServices: "Please select any services you're interested in and fill out the form",
            yourName: "Your Name*",
            petName: "Pet Name(s)*",
            email: "Email*",
            phone: "Phone*",
            petType: "Pet Type*",
            location: "Your Location*",
            help: "How can we help?",
            makeReservation: "Make a Reservation",
            alert: "Please fill out all required fields.",
            success: "Reservation submitted!",
            services: ["Cafe Visit", "Dog Cake", "Swimming Pool", "Dog Day Care"]
        },
        zh: {
            numberOfPeople: "人數",
            chooseDate: "選擇日期",
            pickTime: "選擇時間",
            back: "返回",
            continue: "下一步",
            requestServices: "服務預約",
            selectServices: "請選擇您需要的服務並填寫表單",
            yourName: "您的名字*",
            petName: "寵物名字*",
            email: "電子郵件*",
            phone: "電話*",
            petType: "寵物類型*",
            location: "您的地點*",
            help: "我們可以怎麼幫助您？",
            makeReservation: "提交預約",
            alert: "請填寫所有必填欄位。",
            success: "預約已提交！",
            services: ["到店服務", "狗狗蛋糕", "游泳池", "狗狗日托"]
        }
    };

    const t = texts[lang];

    const [step, setStep] = useState(1);
    const [people, setPeople] = useState(1);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        petName: "",
        petType: "",
        location: "",
        message: "",
        services: [],
    });

    const times = [
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "17:00", "17:30"
    ];

    const toggleService = (service) => {
        setFormData((prev) => {
            const exists = prev.services.includes(service);
            return {
                ...prev,
                services: exists ? prev.services.filter(s => s !== service) : [...prev.services, service]
            };
        });
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReservation = () => {
        const requiredFields = ["name", "phone", "email", "petName", "petType", "location"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                alert(t.alert);
                return;
            }
        }
        alert(t.success);
    };

    return (
        <div className="min-h-screen bg-white p-6 flex flex-col items-center">
            <div className="cursor-pointer" onClick={() => navigate(`/?lang=${lang}`)}>
                <img src="/logo.png" alt="logo" className="h-16" />
            </div>

            {step === 1 && (
                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">{t.numberOfPeople}</h2>
                    <select
                        className="w-full mb-6 p-2 border rounded"
                        value={people}
                        onChange={(e) => setPeople(e.target.value)}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>

                    <h2 className="text-xl font-bold mb-4">{t.chooseDate}</h2>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        className="w-full mb-6 p-2 border rounded"
                    />

                    <h2 className="text-xl font-bold mb-4">{t.pickTime}</h2>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {times.map((tVal) => (
                            <button
                                key={tVal}
                                onClick={() => setTime(tVal)}
                                className={`py-2 rounded border ${time === tVal ? "bg-purple-500 text-white" : "bg-white"}`}
                            >
                                {tVal}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => navigate(`/?lang=${lang}`)} className="bg-gray-300 px-4 py-2 rounded">{t.back}</button>
                        <button onClick={() => setStep(2)} className="bg-purple-500 text-white px-4 py-2 rounded">{t.continue}</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="w-full max-w-2xl">
                    <h2 className="text-xl font-bold mb-4">{t.requestServices}</h2>

                    <p className="mb-2">{t.selectServices}</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {t.services.map((label, i) => {
                            const serviceKey = texts.en.services[i];
                            return (
                                <button
                                    key={serviceKey}
                                    onClick={() => toggleService(serviceKey)}
                                    className={`flex flex-col items-center justify-center p-2 border rounded gap-2 ${formData.services.includes(serviceKey) ? "bg-purple-500 text-white" : "bg-white"}`}
                                >
                                    <img src={`/icons/${serviceKey.replace(/ /g, "_").toLowerCase()}.png`} alt={serviceKey} className="h-8 w-8" />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input name="name" placeholder={t.yourName} onChange={handleInput} className="p-2 border rounded" />
                        <input name="petName" placeholder={t.petName} onChange={handleInput} className="p-2 border rounded" />
                        <input name="email" placeholder={t.email} onChange={handleInput} className="p-2 border rounded" />
                        <input name="phone" placeholder={t.phone} onChange={handleInput} className="p-2 border rounded" />
                        <input name="petType" placeholder={t.petType} onChange={handleInput} className="p-2 border rounded" />
                        <input name="location" placeholder={t.location} onChange={handleInput} className="p-2 border rounded" />
                    </div>

                    <textarea
                        name="message"
                        placeholder={t.help}
                        onChange={handleInput}
                        className="w-full h-24 p-2 border rounded mb-4"
                    />

                    <div className="flex justify-between">
                        <button onClick={() => setStep(1)} className="bg-gray-300 px-4 py-2 rounded">{t.back}</button>
                        <button onClick={handleReservation} className="bg-purple-500 text-white px-4 py-2 rounded">{t.makeReservation}</button>
                    </div>
                </div>
            )}

            <footer className="mt-10 text-xs text-gray-500">powered by Sangchul</footer>
        </div>
    );
};

export default Booking;