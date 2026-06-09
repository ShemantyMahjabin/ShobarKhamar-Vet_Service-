import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function VetRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: 'DLS-2026-00921',
    specialization: 'Cattle, dairy, goat',
    clinicName: '',
    clinicAddress: '',
  });

  const steps = ['Personal', 'License', 'Coverage', 'Review'];

  return (
    <div className="min-h-screen bg-[#F8FCFA] pb-24">
      <div className="flex justify-between items-center px-6 py-3 bg-[#F8FCFA]">
        <span className="text-xs font-bold text-[#6B7785]">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-4 rounded-full bg-[#6B7785]" />
          <div className="w-5 h-2.5 border border-[#6B7785] rounded" />
        </div>
      </div>

      <div className="px-6 pt-4 pb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back to login
        </button>

        <h1 className="text-2xl font-extrabold text-[#17212B] mb-1">Vet Registration</h1>
        <p className="text-sm font-medium text-[#6B7785]">Credentials, service coverage, and approval</p>
      </div>

      <div className="px-6 mb-6 flex gap-3">
        {steps.map((stepName, index) => (
          <div key={stepName} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full h-1 rounded-full mb-2 ${
                index + 1 <= step ? 'bg-[#1E9E6F]' : 'bg-[#DCE7DF]'
              }`}
            />
            <span
              className={`text-xs font-bold ${
                index + 1 === step ? 'text-[#1E9E6F]' : 'text-[#6B7785]'
              }`}
            >
              {stepName}
            </span>
          </div>
        ))}
      </div>

      <div className="px-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#17212B]">Personal information</h2>
            <input
              type="text"
              placeholder="Dr. Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
            <input
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
            <input
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#17212B]">Professional credentials</h2>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
            <div className="rounded-[20px] bg-[#E6F7EF] p-4">
              <p className="text-sm font-bold text-[#17212B]">Documents uploaded</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">Degree PDF</p>
              <p className="mt-1 text-xs font-medium text-[#6B7785]">License PDF</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#17212B]">Clinic and service coverage</h2>
            <input
              type="text"
              placeholder="Veterinary clinic name"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm"
            />
            <textarea
              rows={3}
              placeholder="Full address with area and district"
              value={formData.clinicAddress}
              onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[#DCE7DF] rounded-xl text-sm resize-none"
            />
            <div className="rounded-[20px] bg-white border border-[#DCE7DF] p-4 space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1E9E6F]" />
                <span className="text-sm font-medium text-[#17212B]">In-clinic consultation</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1E9E6F]" />
                <span className="text-sm font-medium text-[#17212B]">Farm visit</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1E9E6F]" />
                <span className="text-sm font-medium text-[#17212B]">Video consultation</span>
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#17212B]">Review and submit</h2>
            <div className="rounded-[20px] bg-white border border-[#DCE7DF] p-4 text-sm text-[#17212B] space-y-2">
              <p>License: {formData.licenseNumber}</p>
              <p>Specialization: {formData.specialization}</p>
              <p>Coverage: Clinic, farm visit, video</p>
            </div>
            <div className="rounded-[20px] bg-[#FFF5DF] p-4">
              <p className="text-sm font-bold text-[#17212B]">Admin verification pending</p>
              <p className="mt-1 text-xs font-medium text-[#6B7785]">You&apos;ll be notified after approval.</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 bg-white border border-[#DCE7DF] rounded-2xl text-sm font-bold text-[#17212B]"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                navigate('/vet-dashboard');
              }
            }}
            className="flex-1 h-12 bg-[#1E9E6F] rounded-2xl text-sm font-bold text-white"
          >
            {step === 4 ? 'Submit application' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
