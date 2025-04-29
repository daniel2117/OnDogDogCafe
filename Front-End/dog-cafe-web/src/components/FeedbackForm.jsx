import React, { useState } from "react";
import { feedbackApi } from "../services/api";

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null);

    const handleClick = (value) => {
        setRating(value);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex" onMouseLeave={() => setHover(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onClick={() => handleClick(star)}
                        className={`w-8 h-8 cursor-pointer transition-colors ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.145 3.51a1 1 0 00.95.69h3.69c.969 0 1.371 1.24.588 1.81l-2.986 2.174a1 1 0 00-.364 1.118l1.145 3.51c.3.921-.755 1.688-1.54 1.118l-2.986-2.174a1 1 0 00-1.176 0l-2.986 2.174c-.784.57-1.838-.197-1.539-1.118l1.145-3.51a1 1 0 00-.364-1.118L2.367 8.937c-.783-.57-.38-1.81.588-1.81h3.69a1 1 0 00.951-.69l1.145-3.51z" />
                    </svg>
                ))}
            </div>
            <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
        </div>
    );
};

const FeedbackForm = ({ email, onClose }) => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name || !rating || !comment) {
            alert("Please complete all fields.");
            return;
        }

        const payload = {
            email,
            name,
            rating: parseFloat(rating),
            comment
        };

        try {
            setSubmitting(true);
            await feedbackApi.submit(payload);
            alert("Feedback submitted successfully!");
            onClose();
        } catch (err) {
            alert(err.message || "Failed to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Leave Feedback</h2>

                <div className="mb-3">
                    <label className="block text-sm font-medium">Email</label>
                    <input type="email" value={email} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium">Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border rounded px-3 py-2" rows={4}></textarea>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
