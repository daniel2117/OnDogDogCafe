import { useLocation, useNavigate } from "react-router-dom";

const AdoptionApplicationView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { application } = state || {};

    if (!application) {
        return <div className="p-6">No application data found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Adoption Application</h2>

            <div className="space-y-4 text-sm">
                <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>Phone:</strong> {application.phone}</p>
                <p><strong>Address:</strong> {application.address.line1}, {application.address.line2}, {application.address.town}</p>
                <p><strong>Home Situation:</strong> {application.homeSituation}</p>
                <p><strong>Household Setting:</strong> {application.householdSetting}</p>
                <p><strong>Activity Level:</strong> {application.activityLevel}</p>
                <p><strong>Income Level:</strong> {application.incomeLevel}</p>
                <p><strong>Adults:</strong> {application.adults}</p>
                <p><strong>Children:</strong> {application.children}</p>
                <p><strong>Youngest Child Age:</strong> {application.youngestAge}</p>
                <p><strong>Visiting Children:</strong> {application.hasVisitingChildren}</p>
                <p><strong>Flatmates:</strong> {application.hasFlatmates}</p>
                <p><strong>Other Animals:</strong> {application.hasOtherAnimals}</p>
                <p><strong>Neutered:</strong> {application.neutered}</p>
                <p><strong>Vaccinated:</strong> {application.vaccinated}</p>
                <p><strong>allergies:</strong> {application.allergies}</p>
                <p><strong>experience:</strong> {application.experience}</p>
                <p><strong>visiting Age:</strong> {application.visitingAge}</p>
                <p><strong>other Animal Details: </strong> {application.otherAnimalDetails}</p>
                <p className="text-gray-500 italic">Uploaded home images are securely stored and not publicly displayed.</p>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                    Back
                </button>

                <button
                    onClick={() => navigate(`/adoption/apply?lang=${application.lang || 'en'}`, {
                        state: { application, modify: true }
                    })}
                    className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                    Update Application
                </button>

            </div>
        </div>
    );
};

export default AdoptionApplicationView;
