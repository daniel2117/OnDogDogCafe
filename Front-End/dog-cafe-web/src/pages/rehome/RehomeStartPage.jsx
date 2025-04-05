import React, { useState } from 'react';

const RehomeStartPage = () => {
  const [agreed, setAgreed] = useState(false);

  const handleCheckbox = () => {
    setAgreed(!agreed);
  };

  const handleStart = () => {
    if (!agreed) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }
    // navigate to the next step
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-10 flex flex-col items-center text-gray-700">
      {/* Breadcrumbs */}
      <div className="w-full max-w-4xl text-sm text-gray-500 mb-2">
        Home {'>'} Rehome {'>'} <span className="text-purple-600 font-semibold">Choose to Rehome</span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        {['Start', 'Primary Questions', "Pet's Images", 'Characteristics', 'Key Facts', "Pet's Story", 'Documents', 'Confirm'].map((step, i) => (
          <div key={i} className="flex flex-col items-center text-xs text-center">
            <div className={`w-6 h-6 rounded-full border-2 ${i === 0 ? 'bg-purple-500 text-white' : 'border-gray-300'} flex items-center justify-center`}>{i + 1}</div>
            <div className="mt-1 text-[10px] w-16">{step}</div>
          </div>
        ))}
      </div>

      {/* User Info Card */}
      <div className="w-full max-w-md border rounded-lg shadow p-4 flex items-center gap-4 mb-6">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" className="w-16 h-16 rounded-full object-cover" />
        <div className="text-sm">
          <div><strong>Email:</strong> SamantaSmith@Gmail.com</div>
          <div><strong>First name:</strong> Samanta</div>
          <div><strong>Last name:</strong> Smith</div>
        </div>
      </div>

      {/* Terms & Privacy Checkbox */}
      <div className="w-full max-w-md mb-4 text-xs text-gray-500">
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={agreed} onChange={handleCheckbox} className="mt-1" />
          <span>I have read and agreed to the <a href="#" className="underline text-blue-600">Terms</a> and <a href="#" className="underline text-blue-600">Privacy Policy</a></span>
        </label>
      </div>

      {/* Start Button */}
      <div className="w-full max-w-md mb-10">
        <p className="text-xs text-gray-500 mb-3">To apply for <span className="text-purple-700 underline">Rehome pet</span> you need to complete some fields. Click Start</p>
        <button
          onClick={handleStart}
          className={`w-full py-2 rounded text-white ${agreed ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}
        >
          Start
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        <button className="mb-2 border px-4 py-1 rounded">Book Now</button>
        <div>6613 2128</div>
        <div>何文田梭道3號1樓<br />1/F, 3 Soares Avenue</div>
        <div className="mt-2">©2025 by On Dog Dog Cafe.</div>
      </div>
    </div>
  );
};

export default RehomeStartPage;
