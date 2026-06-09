import { useNavigate } from 'react-router-dom';
import { animals } from '../data/animals';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function FarmManagement() {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2">
        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17212B]">My Livestock</h1>
            <p className="mt-1 text-sm font-medium text-[#6B7785]">Add, edit, and monitor animal status</p>
          </div>
          <button
            onClick={() => navigate('/add-animal')}
            className="rounded-2xl bg-[#1E9E6F] px-4 py-2 text-sm font-bold text-white"
          >
            + Add
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {animals.map((animal) => (
            <div key={animal.id} className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
              <p className="text-sm font-extrabold text-[#17212B]">{animal.id} • {animal.name}</p>
              <p className="mt-1 text-xs font-semibold text-[#6B7785]">{animal.breed} • {animal.age}</p>
              <p className="mt-2 text-xs font-medium text-[#17212B]">{animal.description}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#EAF3FB] px-3 py-1 text-[10px] font-bold text-[#0F4C81]">{animal.status}</span>
                <button
                  onClick={() => navigate('/booking')}
                  className="rounded-2xl bg-[#E6F7EF] px-4 py-2 text-xs font-bold text-[#1E9E6F]"
                >
                  Get vet service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
