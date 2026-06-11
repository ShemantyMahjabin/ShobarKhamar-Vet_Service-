import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { animals } from '../data/animals';
import { addVaccinationRecord } from '../data/vaccinationRecords';
import { vaccineCatalog } from '../data/vaccines';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

type AnimalKind = 'cow' | 'cattle' | 'calf' | 'goat' | 'poultry';

const vaccinationCenters = [
  'Badda Livestock Vaccine Point',
  'Savar Field Vaccination Camp',
  'Keraniganj Goat Care Center',
];

const lastGivenDates: Record<string, string> = {
  'Cow A12-1': '2025-12-11',
  'Cow A12-3': '2025-06-20',
  'Goat G08-4': '2025-06-10',
  'Goat G08-5': '2025-06-18',
  'Goat G08-6': '2025-12-01',
  'Calf C03-2': '2025-06-14',
};

function getAnimalKind(animalId: string): AnimalKind {
  if (animalId.startsWith('Cow')) return 'cow';
  if (animalId.startsWith('Goat')) return 'goat';
  if (animalId.startsWith('Calf')) return 'calf';
  if (animalId.startsWith('Poultry')) return 'poultry';
  return 'cattle';
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getDurationDays(lastDate: string, currentDate: string) {
  const last = new Date(`${lastDate}T00:00:00`).getTime();
  const current = new Date(`${currentDate}T00:00:00`).getTime();
  return Math.round((current - last) / (1000 * 60 * 60 * 24));
}

export function GiveVaccine() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedVaccineId = Number(new URLSearchParams(location.search).get('vaccineId'));
  const selectedVaccineId = vaccineCatalog.some((vaccine) => vaccine.id === requestedVaccineId)
    ? requestedVaccineId
    : vaccineCatalog[0]?.id ?? 1;
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([animals[0].id, animals[1].id]);
  const [selectedDate, setSelectedDate] = useState('2026-06-09');
  const [selectedCenter, setSelectedCenter] = useState(vaccinationCenters[0]);
  const [notification, setNotification] = useState('');

  const selectedAnimals = animals.filter((animal) => selectedAnimalIds.includes(animal.id));
  const selectedVaccine = vaccineCatalog.find((vaccine) => vaccine.id === selectedVaccineId) ?? vaccineCatalog[0];

  const animalSummaries = useMemo(() => {
    return selectedAnimals.map((animal) => {
      const animalKind = getAnimalKind(animal.id);
      const isEligible = selectedVaccine.supports.includes(animalKind);
      const lastDate = lastGivenDates[`${animal.id}-${selectedVaccine.id}`] ?? '2025-06-01';
      const durationDays = getDurationDays(lastDate, selectedDate);
      const isTimingOk =
        durationDays >= selectedVaccine.recommendedDays - 14 &&
        durationDays <= selectedVaccine.recommendedDays + 30;

      return {
        animal,
        isEligible,
        lastDate,
        durationDays,
        isTimingOk,
      };
    });
  }, [selectedAnimals, selectedVaccine, selectedDate]);

  const eligibleAnimalIds = animalSummaries.filter((item) => item.isEligible).map((item) => item.animal.id);
  const ineligibleAnimalIds = animalSummaries.filter((item) => !item.isEligible).map((item) => item.animal.id);

  function toggleAnimal(animalId: string) {
    setSelectedAnimalIds((current) => {
      if (current.includes(animalId)) {
        if (current.length === 1) return current;
        return current.filter((id) => id !== animalId);
      }
      return [...current, animalId];
    });
  }

  function handleDone() {
    addVaccinationRecord({
      vaccineId: selectedVaccine.id,
      animalIds: selectedAnimalIds,
      eligibleAnimalIds,
      ineligibleAnimalIds,
      date: selectedDate,
      center: selectedCenter,
      status: 'pending',
    });

    setNotification('Vaccination record scheduled. Please confirm it from the vaccination records page.');
    navigate('/vaccination-records');
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="h-[844px] overflow-y-auto px-6 pb-24 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => navigate('/vaccination-management')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <section className="mt-4 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Animals from farm</label>
          <div className="mt-3 space-y-3">
            {animals.map((animal) => {
              const isSelected = selectedAnimalIds.includes(animal.id);
              return (
                <button
                  key={animal.id}
                  onClick={() => toggleAnimal(animal.id)}
                  className={`flex w-full items-center justify-between rounded-[18px] border p-4 text-left ${
                    isSelected ? 'border-[#1E9E6F] bg-[#E6F7EF]' : 'border-[#DCE7DF] bg-white'
                  }`}
                >
                  <div>
                    <p className="text-sm font-extrabold text-[#17212B]">{animal.id}</p>
                    <p className="mt-1 text-xs font-medium text-[#6B7785]">
                      {animal.name} • {animal.breed}
                    </p>
                  </div>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                      isSelected ? 'bg-[#1E9E6F] text-white' : 'bg-[#EEF1F4] text-[#6B7785]'
                    }`}
                  >
                    {isSelected ? '✓' : '+'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 space-y-4 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <div className="rounded-[18px] bg-[#F8FCFA] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Selected vaccine</p>
            <p className="mt-2 text-lg font-extrabold text-[#17212B]">{selectedVaccine.name}</p>
            <p className="mt-1 text-xs font-medium text-[#6B7785]">
              {selectedVaccine.dose} • {selectedVaccine.schedule}
            </p>
          </div>

          <div className="space-y-2">
            {animalSummaries.map((item) => (
              <div key={item.animal.id} className="flex items-center justify-between gap-3 rounded-[16px] bg-[#F8FCFA] px-4 py-3">
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">{item.animal.id}</p>
                  <p className="text-[11px] font-medium text-[#6B7785]">{selectedVaccine.name}</p>
                </div>
                {item.isEligible ? (
                  <span className="rounded-full bg-[#E6F7EF] px-3 py-1 text-[10px] font-bold text-[#1E9E6F]">
                    Eligible
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FDEBEB] px-3 py-1 text-[10px] font-bold text-[#DE3B40]">
                    Not eligible
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#DCE7DF] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7785]">Vaccine center</label>
              <select
                value={selectedCenter}
                onChange={(event) => setSelectedCenter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#DCE7DF] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
              >
                {vaccinationCenters.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <h2 className="text-base font-extrabold text-[#17212B]">Vaccination table</h2>
          <p className="mt-1 text-xs font-medium text-[#6B7785]">Last date, current date, duration, and timing status.</p>

          <div className="mt-4 space-y-3">
            {animalSummaries.map((item) => (
              <div key={item.animal.id} className="rounded-[20px] bg-[#F8FCFA] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold text-[#17212B]">{item.animal.id}</p>
                  {!item.isEligible ? (
                    <span className="rounded-full bg-[#FDEBEB] px-3 py-1 text-[10px] font-bold text-[#DE3B40]">
                      Not eligible for this vaccine
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-[16px] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Last date</p>
                    <p className="mt-1 text-sm font-extrabold text-[#17212B]">{formatDate(item.lastDate)}</p>
                  </div>
                  <div className="rounded-[16px] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Current date</p>
                    <p className="mt-1 text-sm font-extrabold text-[#17212B]">{formatDate(selectedDate)}</p>
                  </div>
                  <div className="rounded-[16px] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Duration</p>
                    <p className="mt-1 text-sm font-extrabold text-[#17212B]">{item.durationDays} days</p>
                  </div>
                  <div className="rounded-[16px] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Dose given time</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
                          item.isEligible && item.isTimingOk
                            ? 'bg-[#E6F7EF] text-[#1E9E6F]'
                            : 'bg-[#FDEBEB] text-[#DE3B40]'
                        }`}
                      >
                        {item.isEligible && item.isTimingOk ? '✓' : '✕'}
                      </span>
                      <p className="text-sm font-extrabold text-[#17212B]">
                        {item.isEligible && item.isTimingOk ? 'Right time' : 'Wrong time'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={handleDone}
          className="mt-5 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
        >
          Done
        </button>

        {notification ? (
          <div className="mt-3 rounded-[18px] bg-[#E6F7EF] px-4 py-3 text-sm font-bold text-[#1E9E6F]">
            {notification}
          </div>
        ) : null}
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
