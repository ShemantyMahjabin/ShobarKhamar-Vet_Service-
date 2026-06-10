import { useNavigate } from 'react-router-dom';
import bangladeshHeatmap from '../../imports/cattle_disease_real_bangladesh_heatmap_mobile_v2.svg';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const diseaseAlerts = [
  { disease: 'Avian flu', area: 'North region', risk: 'High', cases: 23, trend: 'Increasing' },
  { disease: 'Foot-and-mouth disease', area: 'East region', risk: 'Medium', cases: 12, trend: 'Stable' },
  { disease: 'Newcastle disease', area: 'South region', risk: 'Low', cases: 5, trend: 'Decreasing' },
];

export function DiseaseHeatmap() {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2 pb-8">
        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="mb-4 rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <h1 className="text-3xl font-black text-[#17212B]">Disease Heatmap</h1>

        <div className="mt-6 rounded-[28px] border border-[#90caf9] bg-[#EAF3FB] p-6">
          <p className="text-sm font-bold text-[#0F4C81]">Active alert</p>
          <p className="mt-2 text-lg font-extrabold text-[#17212B]">
            Avian flu cases are increasing in the North region
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-[#DCE7DF] bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#17212B]">Bangladesh heatmap</h2>
            </div>
            <div className="rounded-full bg-[#F8FCFA] px-3 py-1 text-[10px] font-bold text-[#17212B]">
              BD map
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-[#DCE7DF] bg-[#F8FCFA]">
            <img
              src={bangladeshHeatmap}
              alt="Bangladesh cattle disease heatmap"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
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

        <div className="mt-6 rounded-[28px] border border-[#DCE7DF] bg-white p-6">
          <div>
            <p className="text-lg font-extrabold text-[#17212B]">Want to schedule a preventive checkup?</p>
            <p className="mt-1 text-sm font-medium text-[#6B7785]">
              Book a veterinarian to protect your herd before disease spreads.
            </p>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="mt-4 w-full rounded-2xl bg-[#1E9E6F] px-5 py-3 text-sm font-bold text-white"
          >
            Book now
          </button>
        </div>
      </div>

      <MobileBottomNav active="detect disease" />
    </MobileShell>
  );
}
