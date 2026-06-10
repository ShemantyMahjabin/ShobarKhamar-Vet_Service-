import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVaccines } from '../data/vaccines';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

type CenterRecord = {
  name: string;
  supports: string[];
  vaccines: string[];
  stock: string[];
};

export function VaccinationCenters() {
  const navigate = useNavigate();
  const [vaccines] = useState(() => getAllVaccines());

  const centers = useMemo(() => {
    const centerMap = new Map<string, CenterRecord>();

    vaccines.forEach((vaccine) => {
      if (!vaccine.centerName) return;

      const center = centerMap.get(vaccine.centerName) ?? {
        name: vaccine.centerName,
        supports: [],
        vaccines: [],
        stock: [],
      };

      center.supports = Array.from(new Set([...center.supports, ...vaccine.supports]));
      center.vaccines = Array.from(new Set([...center.vaccines, vaccine.name]));
      center.stock = Array.from(new Set([...center.stock, vaccine.stock]));
      centerMap.set(vaccine.centerName, center);
    });

    return Array.from(centerMap.values());
  }, [vaccines]);

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2">
        <button
          onClick={() => navigate('/vaccination-management')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <h1 className="mt-4 text-2xl font-extrabold text-[#17212B]">Vaccination Centers</h1>

        <div className="mt-5 space-y-3">
          {centers.map((center) => (
            <section key={center.name} className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-[#17212B]">{center.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#1E9E6F]">{center.vaccines.length} vaccine entries</p>
                </div>
                <span className="rounded-full bg-[#EAF3FB] px-3 py-1 text-[10px] font-bold text-[#0F4C81]">Server</span>
              </div>

              <div className="mt-4 space-y-2 rounded-[18px] bg-[#F8FCFA] p-4">
                <p className="text-xs font-semibold text-[#6B7785]">Supports: {center.supports.join(', ') || 'Not set'}</p>
                <p className="text-xs font-semibold text-[#6B7785]">Available vaccines: {center.vaccines.join(', ')}</p>
                <p className="text-xs font-bold text-[#17212B]">Stock: {center.stock.join(', ') || 'Not set'}</p>
              </div>

              <button
                onClick={() => navigate('/booking')}
                className="mt-4 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
              >
                Book vaccination visit
              </button>
            </section>
          ))}

          {centers.length === 0 ? (
            <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-5 text-center">
              <p className="text-sm font-extrabold text-[#17212B]">No vaccination centers found</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">
                Add a vaccine with a center name first, then it will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
