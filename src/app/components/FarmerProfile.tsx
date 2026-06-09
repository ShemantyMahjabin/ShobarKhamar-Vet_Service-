import { useNavigate } from 'react-router-dom';
import { getVaccinationRecords } from '../data/vaccinationRecords';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function FarmerProfile() {
  const navigate = useNavigate();
  const records = getVaccinationRecords();
  const pendingCount = records.filter((record) => record.status === 'pending').length;

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

        <section className="mt-4 rounded-[24px] bg-[#17212B] p-5 text-white">
          <h1 className="text-2xl font-extrabold">Farmer Profile</h1>
          <p className="mt-2 text-sm font-medium text-white/75">Rahim • Livestock owner</p>
        </section>

        <section className="mt-5 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#17212B]">Vaccination records</h2>
              <p className="mt-1 text-xs font-medium text-[#6B7785]">
                Open the full vaccination record list from your profile.
              </p>
            </div>
            <button
              onClick={() => navigate('/vaccination-records')}
              className="rounded-2xl bg-[#1E9E6F] px-4 py-2 text-sm font-bold text-white"
            >
              + Record
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[18px] bg-[#F8FCFA] p-4">
              <p className="text-xl font-black text-[#17212B]">{records.length}</p>
              <p className="text-xs font-bold text-[#6B7785]">Total records</p>
            </div>
            <div className="rounded-[18px] bg-[#FFF5DF] p-4">
              <p className="text-xl font-black text-[#17212B]">{pendingCount}</p>
              <p className="text-xs font-bold text-[#6B7785]">Pending records</p>
            </div>
          </div>
        </section>
      </div>

      <MobileBottomNav active="home" />
    </MobileShell>
  );
}
