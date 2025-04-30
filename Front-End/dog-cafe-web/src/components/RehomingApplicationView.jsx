import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RehomingApplicationView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const application = state?.application;

    if (!application) {
        return <div className="p-6">No application data found.</div>;
    }

    const { ownerInfo, petInfo, rehomingDetails, media, status, createdAt } = application;
    const checklist = petInfo.checklist || {};

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Rehoming Application</h1>

            <section>
                <h2 className="text-lg font-semibold">Owner Information</h2>
                <p><strong>Email:</strong> {ownerInfo.email}</p>
                <p><strong>Name:</strong> {ownerInfo.firstName} {ownerInfo.lastName}</p>
            </section>

            <section>
                <h2 className="text-lg font-semibold mt-4">Pet Information</h2>
                <p><strong>Name:</strong> {petInfo.name}</p>
                <p><strong>Type:</strong> {petInfo.type}</p>
                <p><strong>Age:</strong> {petInfo.age}</p>
                <p><strong>Size:</strong> {petInfo.size}</p>
                <p><strong>Gender:</strong> {petInfo.gender}</p>
                <p><strong>Breed:</strong> {petInfo.breed}</p>
                <p><strong>Color:</strong> {petInfo.color}</p>
                <p><strong>Spayed/Neutered:</strong> {petInfo.isSpayedNeutered ? "Yes" : "No"}</p>
                <p><strong>Description:</strong> {petInfo.description}</p>

                <div className="mt-2">
                    <h3 className="font-medium">Checklist:</h3>
                    <ul className="list-disc list-inside">
                        {Object.entries(checklist).map(([key, value]) => (
                            <li key={key}>{key}: {value ? "Yes" : "No"}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold mt-4">Rehoming Details</h2>
                <p><strong>Reason:</strong> {rehomingDetails.reason}</p>
                <p><strong>Time Window:</strong> {rehomingDetails.timeWindow}</p>
            </section>

            <section>
                <h2 className="text-lg font-semibold mt-4">Media</h2>
                <p className="text-sm italic text-gray-500 mb-2">Uploaded photos and documents are stored securely and are not publicly viewable.</p>

            </section>

            <section className="mt-4">
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Submitted At:</strong> {new Date(createdAt).toLocaleString()}</p>
            </section>

            <div className="flex gap-4 mt-6">
                <button onClick={() => navigate(-1)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">
                    Back
                </button>
                {status === 'pending' && (
                    <button
                        onClick={() => navigate(`/rehome/apply?lang=${application.lang || 'en'}`, {
                            state: { application, modify: true }
                        })}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Update Application
                    </button>
                )}
            </div>
        </div>
    );
};

export default RehomingApplicationView;