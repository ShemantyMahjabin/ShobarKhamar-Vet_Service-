import { useNavigate } from 'react-router-dom';
import { getVaccinationRecords } from '../data/vaccinationRecords';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function FarmerProfile() {
  const navigate = useNavigate();
  const records = getVaccinationRecords();
  const pendingCount = records.filter((record) => record.status === 'pending').length;
  const acceptedAppointmentCount = 1;

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pb-8 pt-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight text-[#17212B]">Rahim</h1>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight text-[#17212B]">Profile</h2>
            <p className="mt-4 max-w-[220px] text-[16px] font-semibold leading-8 text-[#6B7785]">
              Farm records and vaccine confirmation
            </p>
          </div>

          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="rounded-full bg-[#F8FCFA] px-6 py-4 text-[16px] font-extrabold text-[#17212B]"
          >
            Close
          </button>
        </div>

        <section className="mt-8 rounded-[28px] border border-[#DCE7DF] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[28px] font-extrabold leading-none text-[#17212B]">+</p>
              <h3 className="mt-4 text-[24px] font-extrabold leading-tight text-[#17212B]">
                Vaccination
                <br />
                record
              </h3>
            </div>
            <div className="rounded-[24px] bg-[#EAF7EF] px-6 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#1E9E6F]">{records.length}</p>
              <p className="mt-1 text-[14px] font-bold text-[#1E9E6F]">records</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/vaccination-records')}
            className="mt-5 w-full rounded-[22px] bg-[#56A774] px-4 py-4 text-[16px] font-extrabold text-white"
          >
            Open records
          </button>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#DCE7DF] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-extrabold leading-tight text-[#17212B]">
                Appointment
                <br />
                schedule
              </h3>
            </div>
            <div className="rounded-[24px] bg-[#EAF7EF] px-6 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#1E9E6F]">{acceptedAppointmentCount}</p>
              <p className="mt-1 text-[14px] font-bold text-[#1E9E6F]">accepted</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/appointment-schedule')}
            className="mt-5 w-full rounded-[22px] bg-[#56A774] px-4 py-4 text-[16px] font-extrabold text-white"
          >
            Open appointments
          </button>
        </section>

        <section className="mt-6 rounded-[28px] border border-[#DCE7DF] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-extrabold leading-tight text-[#17212B]">
                Vaccination
                <br />
                schedule
              </h3>
            </div>
            <div className="rounded-[24px] bg-[#EAF7EF] px-6 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#1E9E6F]">{pendingCount}</p>
              <p className="mt-1 text-[14px] font-bold text-[#1E9E6F]">reminders</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/vaccination-schedule')}
            className="mt-5 w-full rounded-[22px] bg-[#56A774] px-4 py-4 text-[16px] font-extrabold text-white"
          >
            Open schedule
          </button>
        </section>
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
