import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVaccinationRecords } from '../data/vaccinationRecords';
import { animals } from '../data/animals';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function FarmerDashboard() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [records, setRecords] = useState(getVaccinationRecords());

  const pendingCount = records.filter((record) => record.status === 'pending').length;

  function openProfilePanel() {
    setRecords(getVaccinationRecords());
    setIsProfileOpen(true);
  }

  function openVaccinationRecordsPage() {
    setIsProfileOpen(false);
    navigate('/vaccination-records');
  }

  function openVaccinationSchedulePage() {
    setIsProfileOpen(false);
    navigate('/vaccination-schedule');
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="relative px-6 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17212B]">Good morning, Rahim</h1>
            <p className="mt-1 text-sm font-medium text-[#6B7785]">
              2 alerts • {animals.length} animals monitored
            </p>
          </div>
          <button
            onClick={openProfilePanel}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F7EF]"
          >
            <div className="absolute top-3 h-3.5 w-3.5 rounded-full bg-[#1E9E6F]" />
            <div className="absolute bottom-2 h-4 w-7 rounded-t-full bg-[#1E9E6F] opacity-80" />
          </button>
        </div>

        <div className="mt-6 rounded-[24px] bg-[#1E9E6F] p-6 text-white">
          <p className="text-sm font-bold opacity-90">Today's priority</p>
          <p className="mt-3 text-lg font-extrabold">Cow A12 vaccine due tomorrow</p>
          <button
            onClick={() => navigate('/vaccination-management')}
            className="mt-4 rounded-2xl bg-white px-5 py-2 text-sm font-bold text-[#1E9E6F]"
          >
            View
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[18px] bg-[#E6F7EF] p-4">
            <p className="text-[28px] font-black text-[#17212B]">{animals.length}</p>
            <p className="text-xs font-bold text-[#6B7785]">Animals</p>
          </div>
          <div className="rounded-[18px] bg-[#FFF5DF] p-4">
            <p className="text-[28px] font-black text-[#17212B]">3</p>
            <p className="text-xs font-bold text-[#6B7785]">Cases</p>
          </div>
          <div className="rounded-[18px] bg-[#FDEBEB] p-4">
            <p className="text-[28px] font-black text-[#17212B]">{pendingCount}</p>
            <p className="text-xs font-bold text-[#6B7785]">Pending vaccines</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/add-animal')}
            className="rounded-2xl bg-[#1E9E6F] px-4 py-2 text-xs font-bold text-white"
          >
            Add animal
          </button>
        </div>

        <div className="mt-6 rounded-[20px] border border-[#DCE7DF] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#17212B]">Vaccination</h2>
              <p className="mt-1 text-[11px] font-medium text-[#6B7785]">
                Open the calendar, review reminders, then find a nearby center.
              </p>
            </div>
            <button
              onClick={() => navigate('/vaccination-management')}
              className="rounded-2xl bg-[#E6F7EF] px-4 py-2 text-xs font-bold text-[#1E9E6F]"
            >
              All vaccines
            </button>
          </div>
        </div>

        <h2 className="mt-6 text-lg font-extrabold text-[#17212B]">Quick actions</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/booking')}
            className="rounded-[20px] border border-[#DCE7DF] bg-white p-4 text-left"
          >
            <p className="text-sm font-extrabold text-[#17212B]">Book vet</p>
            <p className="mt-2 text-[11px] font-medium text-[#6B7785]">Nearest verified vets</p>
          </button>
          <button
            onClick={() => navigate('/ai-detection')}
            className="rounded-[20px] border border-[#DCE7DF] bg-white p-4 text-left"
          >
            <p className="text-sm font-extrabold text-[#17212B]">AI check</p>
            <p className="mt-2 text-[11px] font-medium text-[#6B7785]">Upload image and symptoms</p>
          </button>
          <button
            onClick={() => navigate('/heatmap')}
            className="rounded-[20px] border border-[#DCE7DF] bg-white p-4 text-left"
          >
            <p className="text-sm font-extrabold text-[#17212B]">Heatmap</p>
            <p className="mt-2 text-[11px] font-medium text-[#6B7785]">Area disease risk</p>
          </button>
          <button
            onClick={() => navigate('/diagnosis-report')}
            className="rounded-[20px] border border-[#DCE7DF] bg-white p-4 text-left"
          >
            <p className="text-sm font-extrabold text-[#17212B]">Reports</p>
            <p className="mt-2 text-[11px] font-medium text-[#6B7785]">Diagnosis and follow-up</p>
          </button>
        </div>
      </div>

      {isProfileOpen ? (
        <div className="absolute inset-0 z-40 bg-[#17212B]/20">
          <button className="absolute inset-0 h-full w-full cursor-default" onClick={() => setIsProfileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[52%] min-w-[220px] max-w-[220px] overflow-y-auto border-l border-[#DCE7DF] bg-white p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#17212B]">Rahim Profile</h2>
                <p className="mt-1 text-xs font-medium text-[#6B7785]">Farm records and vaccine confirmation</p>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-full bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B]"
              >
                Close
              </button>
            </div>

            <button
              onClick={openVaccinationRecordsPage}
              className="mt-4 w-full rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">+ Vaccination record</p>
                </div>
                <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                  {records.length} records
                </span>
              </div>
            </button>

            <div className="mt-4 space-y-3">
              <section className="rounded-[20px] border border-[#DCE7DF] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-[#17212B]">Vaccination schedule</p>
                  </div>
                  <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                    4 reminders
                  </span>
                </div>

                <button
                  onClick={openVaccinationSchedulePage}
                  className="mt-3 w-full rounded-2xl bg-[#1E9E6F] px-3 py-2 text-xs font-bold text-white"
                >
                  Open schedule
                </button>
              </section>
            </div>
          </aside>
        </div>
      ) : null}

      <MobileBottomNav active="home" />
    </MobileShell>
  );
}
