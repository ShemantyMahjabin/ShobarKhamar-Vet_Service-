import { useNavigate } from 'react-router-dom';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const centers = [
  {
    id: 1,
    name: 'Badda Livestock Vaccine Point',
    distance: '1.8 km away',
    supports: 'Cow, cattle, goat',
    vaccines: 'FMD, HS, Anthrax, PPR',
    slot: 'Next slot: Today, 4:00 PM',
  },
  {
    id: 2,
    name: 'Savar Field Vaccination Camp',
    distance: '3.2 km away',
    supports: 'Cattle and calf focus',
    vaccines: 'Black Quarter, Anthrax, HS',
    slot: 'Next slot: Tomorrow, 10:30 AM',
  },
  {
    id: 3,
    name: 'Keraniganj Goat Care Center',
    distance: '4.1 km away',
    supports: 'Goat and mixed herd support',
    vaccines: 'PPR, Goat pox, Deworming follow-up',
    slot: 'Next slot: Tomorrow, 1:15 PM',
  },
];

export function VaccinationCenters() {
  const navigate = useNavigate();

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
        <p className="mt-1 text-sm font-medium text-[#6B7785]">
          Choose a nearby center, then continue to the booking step.
        </p>

        <div className="mt-5 space-y-3">
          {centers.map((center) => (
            <section key={center.id} className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-[#17212B]">{center.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#1E9E6F]">{center.distance}</p>
                </div>
                <span className="rounded-full bg-[#EAF3FB] px-3 py-1 text-[10px] font-bold text-[#0F4C81]">
                  Nearby
                </span>
              </div>

              <div className="mt-4 space-y-2 rounded-[18px] bg-[#F8FCFA] p-4">
                <p className="text-xs font-semibold text-[#6B7785]">Supports: {center.supports}</p>
                <p className="text-xs font-semibold text-[#6B7785]">Available vaccines: {center.vaccines}</p>
                <p className="text-xs font-bold text-[#17212B]">{center.slot}</p>
              </div>

              <button
                onClick={() => navigate('/booking')}
                className="mt-4 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
              >
                Book vaccination visit
              </button>
            </section>
          ))}
        </div>
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
