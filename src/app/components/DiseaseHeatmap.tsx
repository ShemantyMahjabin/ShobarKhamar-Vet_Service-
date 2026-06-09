import { useNavigate } from 'react-router-dom';

const diseaseAlerts = [
  { disease: 'Avian flu', area: 'North region', risk: 'High', cases: 23, trend: 'Increasing' },
  { disease: 'Foot-and-mouth disease', area: 'East region', risk: 'Medium', cases: 12, trend: 'Stable' },
  { disease: 'Newcastle disease', area: 'South region', risk: 'Low', cases: 5, trend: 'Decreasing' },
];

export function DiseaseHeatmap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FCFA] px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back to dashboard
        </button>

        <h1 className="text-3xl font-black text-[#17212B]">Disease Heatmap</h1>
        <p className="mt-2 text-sm font-medium text-[#6B7785]">
          Seasonal disease patterns and active alerts in your area.
        </p>

        <div className="mt-6 rounded-[28px] border border-[#90caf9] bg-[#EAF3FB] p-6">
          <p className="text-sm font-bold text-[#0F4C81]">Active alert</p>
          <p className="mt-2 text-lg font-extrabold text-[#17212B]">
            Avian flu cases are increasing in the North region
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-[#DCE7DF] bg-white p-6">
          <h2 className="text-lg font-extrabold text-[#17212B]">Interactive heatmap</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-[#FDEBEB] p-6 text-center">
              <p className="text-sm font-bold text-[#DE3B40]">North region</p>
              <p className="mt-2 text-xl font-black text-[#17212B]">High risk</p>
            </div>
            <div className="rounded-[24px] bg-[#FFF5DF] p-6 text-center">
              <p className="text-sm font-bold text-[#F5A524]">East region</p>
              <p className="mt-2 text-xl font-black text-[#17212B]">Medium risk</p>
            </div>
            <div className="rounded-[24px] bg-[#E6F7EF] p-6 text-center">
              <p className="text-sm font-bold text-[#1E9E6F]">South region</p>
              <p className="mt-2 text-xl font-black text-[#17212B]">Low risk</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {diseaseAlerts.map((alert) => (
            <div key={alert.disease} className="rounded-[24px] border border-[#DCE7DF] bg-white p-5">
              <p className="text-lg font-extrabold text-[#17212B]">{alert.disease}</p>
              <p className="mt-2 text-sm font-semibold text-[#6B7785]">{alert.area}</p>
              <p className="mt-1 text-sm font-semibold text-[#6B7785]">Reported cases: {alert.cases}</p>
              <p className="mt-3 inline-flex rounded-full bg-[#F8FCFA] px-3 py-1 text-xs font-bold text-[#17212B]">
                {alert.risk} risk
              </p>
              <p className="mt-3 text-xs font-medium text-[#6B7785]">{alert.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-[#DCE7DF] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-extrabold text-[#17212B]">Want to schedule a preventive checkup?</p>
            <p className="mt-1 text-sm font-medium text-[#6B7785]">
              Book a veterinarian to protect your herd before disease spreads.
            </p>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="rounded-2xl bg-[#1E9E6F] px-5 py-3 text-sm font-bold text-white"
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
