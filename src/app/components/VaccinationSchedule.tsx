import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const vaccineReminders = [
  { id: 1, date: '2026-06-10', vaccineId: 1, vaccineName: 'FMD vaccine', animal: 'Cow A12' },
  { id: 2, date: '2026-06-10', vaccineId: 5, vaccineName: 'PPR vaccine', animal: 'Goat G08' },
  { id: 3, date: '2026-06-12', vaccineId: 2, vaccineName: 'Black Quarter', animal: 'Calf C03' },
  { id: 4, date: '2026-06-15', vaccineId: 6, vaccineName: 'Goat pox vaccine', animal: 'Goat G08' },
];

const weeklyVetAppointments = [
  {
    id: 101,
    date: '2026-06-11',
    vetName: 'Dr. Farhana Akter',
    time: '10:00 AM - 11:00 AM',
    mode: 'Farm visit',
    animals: 'Goat G05',
    status: 'Accepted',
  },
  {
    id: 102,
    date: '2026-06-12',
    vetName: 'Dr. Nadia Islam',
    time: '11:30 AM - 12:30 PM',
    mode: 'In Person',
    animals: 'Cow A12, Goat G08',
    status: 'Accepted',
  },
  {
    id: 103,
    date: '2026-06-15',
    vetName: 'Dr. Mahmud Hasan',
    time: '3:00 PM - 3:30 PM',
    mode: 'Video consultation',
    animals: 'Calf C03',
    status: 'Pending',
  },
];

const scheduleDays = [
  '2026-06-09',
  '2026-06-10',
  '2026-06-11',
  '2026-06-12',
  '2026-06-13',
  '2026-06-14',
  '2026-06-15',
];

const reminderColors = [
  'bg-[#E6F7EF] text-[#1E9E6F]',
  'bg-[#FFF5DF] text-[#B7791F]',
  'bg-[#EAF3FB] text-[#0F4C81]',
  'bg-[#F3ECFF] text-[#7A59C4]',
];

const appointmentCardTone = 'border border-[#D8E8F2] bg-[#EEF7FD] text-[#215B7C]';

function formatFullDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatShortDay(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

export function VaccinationSchedule() {
  const navigate = useNavigate();

  const remindersByDate = useMemo(() => {
    return scheduleDays.map((date) => ({
      date,
      reminders: vaccineReminders.filter((reminder) => reminder.date === date),
      appointments: weeklyVetAppointments.filter((appointment) => appointment.date === date),
    }));
  }, []);

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

        <section className="mt-4 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h1 className="text-2xl font-extrabold text-[#17212B]">Calender</h1>
        </section>

        <section className="mt-5 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#F8FCFA] px-4 py-3">
            <button type="button" className="rounded-xl border border-[#DCE7DF] bg-white px-3 py-2 text-xs font-bold text-[#6B7785]">
              Prev
            </button>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Reminder calendar</p>
              <p className="mt-1 text-lg font-extrabold text-[#17212B]">Jun 9 - Jun 15, 2026</p>
            </div>
            <button type="button" className="rounded-xl border border-[#DCE7DF] bg-white px-3 py-2 text-xs font-bold text-[#6B7785]">
              Next
            </button>
          </div>

          <div className="mt-4 rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#17212B]">Week</span>
            </div>

            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid min-w-[680px] grid-cols-7 gap-3">
                {remindersByDate.map(({ date, reminders, appointments }) => (
                  <div key={date} className="rounded-[18px] border border-[#DCE7DF] bg-white p-3 align-top">
                    <div className="border-b border-[#EEF1F4] pb-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">
                        {formatShortDay(date)}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#17212B]">{formatShortDate(date)}</p>
                    </div>

                    <div className="mt-3 space-y-2">
                      {reminders.length > 0 || appointments.length > 0 ? (
                        <>
                          {reminders.map((reminder, index) => (
                            <button
                              key={reminder.id}
                              type="button"
                              onClick={() => navigate(`/give-vaccine?vaccineId=${reminder.vaccineId}`)}
                              className={`w-full rounded-[14px] px-3 py-3 text-left text-xs font-bold ${
                                reminderColors[index % reminderColors.length]
                              }`}
                            >
                              <p>{reminder.vaccineName}</p>
                              <p className="mt-1 text-[11px] font-semibold opacity-80">{reminder.animal}</p>
                            </button>
                          ))}

                          {appointments.map((appointment) => (
                            <button
                              key={appointment.id}
                              type="button"
                              onClick={() => navigate('/appointment-schedule')}
                              className={`w-full rounded-[14px] px-3 py-3 text-left text-xs font-bold ${appointmentCardTone}`}
                            >
                              <p>
                                {appointment.mode === 'Request vet to visit'
                                  ? 'Vet visit'
                                  : appointment.mode === 'Video consultation'
                                    ? 'Video call'
                                    : appointment.mode}
                              </p>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="rounded-[14px] border border-dashed border-[#DCE7DF] px-3 py-6 text-center text-[11px] font-medium text-[#9AA5B1]">
                          No schedule
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] bg-[#F8FCFA] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Upcoming dates</p>
            <div className="mt-3 max-h-[220px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {remindersByDate
                .filter(({ reminders, appointments }) => reminders.length > 0 || appointments.length > 0)
                .map(({ date, reminders, appointments }) => (
                  <div key={date} className="rounded-[16px] bg-white px-4 py-3">
                    <p className="text-sm font-extrabold text-[#17212B]">{formatFullDate(date)}</p>
                    {reminders.length > 0 ? (
                      <p className="mt-1 text-xs font-medium text-[#6B7785]">
                        Vaccines: {reminders.map((reminder) => reminder.vaccineName).join(', ')}
                      </p>
                    ) : null}
                    {appointments.length > 0 ? (
                      <p className="mt-1 text-xs font-medium text-[#6B7785]">
                        Vet appointments: {appointments.map((appointment) => `${appointment.vetName} (${appointment.mode})`).join(', ')}
                      </p>
                    ) : null}
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
