import { useNavigate } from 'react-router-dom';

const findings = [
  'Primary diagnosis: suspected foot-and-mouth disease',
  'Severity: high priority, immediate isolation advised',
  'Prescription: fever control, hydration support, lesion care',
  'Follow-up: veterinarian review after 48 hours',
];

export function DiagnosisReport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FCFA] px-6 py-6">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/booking')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back to booking
        </button>

        <div className="rounded-[28px] border border-[#DCE7DF] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#17212B]">Diagnosis Report</h1>
              <p className="mt-2 text-sm font-medium text-[#6B7785]">
                AI triage, veterinarian assessment, and treatment plan in one summary.
              </p>
            </div>
            <span className="rounded-full bg-[#E6F7EF] px-4 py-2 text-xs font-bold text-[#1E9E6F]">
              Payment confirmed
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[24px] bg-[#F8FCFA] p-5">
              <p className="text-sm font-bold text-[#6B7785]">Case</p>
              <p className="mt-2 text-lg font-extrabold text-[#17212B]">Cow A12</p>
              <p className="mt-1 text-sm font-semibold text-[#6B7785]">Reviewed by Dr. Nadia Islam</p>
              <p className="mt-2 text-sm font-medium text-[#17212B]">
                Adult dairy cow with fever risk, pregnancy monitoring, and urgent isolation advice.
              </p>
              <p className="mt-4 text-sm font-medium text-[#17212B]">Service mode: farm visit</p>
            </div>
            <div className="rounded-[24px] bg-[#EAF3FB] p-5">
              <p className="text-sm font-bold text-[#0F4C81]">Next step</p>
              <p className="mt-2 text-lg font-extrabold text-[#17212B]">Follow-up on 2026-06-10</p>
              <p className="mt-1 text-sm font-semibold text-[#6B7785]">Vaccination and recovery check</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {findings.map((finding) => (
              <div key={finding} className="rounded-[18px] border border-[#DCE7DF] px-4 py-3 text-sm font-semibold text-[#17212B]">
                {finding}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/booking')}
              className="rounded-2xl bg-[#1E9E6F] px-5 py-3 text-sm font-bold text-white"
            >
              Book follow-up care
            </button>
            <button
              onClick={() => navigate('/vaccination-management')}
              className="rounded-2xl bg-[#E6F7EF] px-5 py-3 text-sm font-bold text-[#1E9E6F]"
            >
              View vaccination plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
