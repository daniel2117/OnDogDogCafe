// Booking.jsx
const Booking = ({ lang }) => {
    const [step, setStep] = useState(1); // 1 or 2
  
    return step === 1 ? <BookingStepOne onContinue={() => setStep(2)} /> : <BookingStepTwo />;
  };
  
