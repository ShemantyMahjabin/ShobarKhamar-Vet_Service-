import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAnimalName,
  getVaccinationRecords,
  processPendingVaccinationRecord,
} from '../data/vaccinationRecords';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function VaccinationRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(getVaccinationRecords());
  const [message, setMessage] = useState('');

  function handleConfirmGiven(recordId: number) {
    const updated = processPendingVaccinationRecord(recordId);
    setRecords(getVaccinationRecords());

    if (updated) {
      setMessage(`${updated.vaccineName} marked as done. Animal vaccination entries were added.`);
    }
  }

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
          <h1 className="text-2xl font-extrabold text-[#17212B]">Vaccination Records</h1>
          <p className="mt-2 text-sm font-medium text-[#6B7785]">
            Review scheduled records and confirm whether the vaccine was actually given.
          </p>
        </section>

        {message ? (
          <div className="mt-4 rounded-[18px] bg-[#E6F7EF] px-4 py-3 text-sm font-bold text-[#1E9E6F]">
            {message}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          {records.map((record) => (
            <section key={record.id} className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-extrabold text-[#17212B]">{record.vaccineName}</h2>
                  <p className="mt-1 text-xs font-medium text-[#6B7785]">
                    {formatDate(record.date)} • {record.center}
                  </p>
                </div>
                {record.status === 'pending' ? (
                  <span className="rounded-2xl bg-[#FFF5DF] px-4 py-2 text-xs font-bold text-[#B7791F]">
                    Pending
                  </span>
                ) : (
                  <span className="rounded-2xl bg-[#E6F7EF] px-4 py-2 text-xs font-bold text-[#1E9E6F]">
                    Done
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-[18px] bg-[#F8FCFA] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Selected animals</p>
                <p className="mt-2 text-sm font-semibold text-[#17212B]">{record.animalIds.join(', ')}</p>
              </div>

              {record.ineligibleAnimalIds.length > 0 ? (
                <div className="mt-3 rounded-[18px] bg-[#FDEBEB] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#DE3B40]">Not eligible</p>
                  <p className="mt-2 text-sm font-semibold text-[#17212B]">
                    {record.ineligibleAnimalIds.join(', ')}
                  </p>
                </div>
              ) : null}

              <div className="mt-4">
                {record.status === 'pending' ? (
                  <div className="rounded-[18px] bg-[#F8FCFA] p-4">
                    <p className="text-sm font-extrabold text-[#17212B]">
                      Have you given this scheduled vaccine?
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleConfirmGiven(record.id)}
                        className="rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
                      >
                        Yes, given
                      </button>
                      <button
                        onClick={() => setMessage(`${record.vaccineName} is still pending confirmation.`)}
                        className="rounded-2xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B]"
                      >
                        Not yet
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">
                  Animal entries under this vaccine
                </p>

                {record.entries.length === 0 ? (
                  <div className="mt-2 rounded-[18px] bg-[#FFF5DF] p-4 text-sm font-semibold text-[#17212B]">
                    No animal entry has been added yet.
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    {record.entries.map((entry) => (
                      <div key={entry.id} className="rounded-[18px] bg-[#F8FCFA] p-4">
                        <p className="text-sm font-extrabold text-[#17212B]">{entry.animalId}</p>
                        <p className="mt-1 text-xs font-medium text-[#6B7785]">
                          {getAnimalName(entry.animalId)} • {entry.vaccineName} • {formatDate(entry.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <MobileBottomNav active="home" />
    </MobileShell>
  );
}
