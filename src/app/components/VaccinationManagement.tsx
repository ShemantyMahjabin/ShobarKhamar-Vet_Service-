import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVaccinationRecords } from '../data/vaccinationRecords';
import { vaccineCatalog } from '../data/vaccines';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const animalFilters = [
  { label: 'All', value: 'all' },
  { label: 'Cow', value: 'cow' },
  { label: 'Cattle', value: 'cattle' },
  { label: 'Calf', value: 'calf' },
  { label: 'Goat', value: 'goat' },
] as const;

const diseaseOptions = [
  'All diseases',
  'Foot and mouth disease',
  'Black quarter',
  'Hemorrhagic septicemia',
  'Anthrax',
  'PPR',
  'Goat pox',
] as const;

const ageChips = [
  { label: '22-28 months', min: 22, max: 28 },
  { label: '28-34 months', min: 28, max: 34 },
  { label: '34-40 months', min: 34, max: 40 },
  { label: '40-46 months', min: 40, max: 46 },
] as const;

const weightChips = [
  { label: '130-170 kg', min: 130, max: 170 },
  { label: '170-210 kg', min: 170, max: 210 },
  { label: '210-250 kg', min: 210, max: 250 },
  { label: '290-330 kg', min: 290, max: 330 },
] as const;

const teethOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

type FilterState = {
  cattleType: (typeof animalFilters)[number]['value'];
  disease: (typeof diseaseOptions)[number];
  ageMin: string;
  ageMax: string;
  weightMin: string;
  weightMax: string;
  teethCount: string;
};

const defaultFilters: FilterState = {
  cattleType: 'all',
  disease: 'All diseases',
  ageMin: '',
  ageMax: '',
  weightMin: '',
  weightMax: '',
  teethCount: '',
};

export function VaccinationManagement() {
  const navigate = useNavigate();
  const searchSegmentRef = useRef<HTMLDivElement | null>(null);
  const vaccinationRecords = useMemo(() => getVaccinationRecords(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimalFilter, setSelectedAnimalFilter] =
    useState<(typeof animalFilters)[number]['value']>('all');
  const [isAnimalFilterMenuOpen, setIsAnimalFilterMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const openGiveVaccine = (vaccineId: number) => navigate(`/give-vaccine?vaccineId=${vaccineId}`);

  function matchesRange(selectedMin: string, selectedMax: string, [itemMin, itemMax]: [number, number]) {
    const min = selectedMin ? Number(selectedMin) : null;
    const max = selectedMax ? Number(selectedMax) : null;
    if (min === null && max === null) return true;
    if (min !== null && itemMax < min) return false;
    if (max !== null && itemMin > max) return false;
    return true;
  }

  function openFilterPanel() {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  }

  function applyFilters() {
    setFilters(draftFilters);
    setSelectedAnimalFilter(draftFilters.cattleType);
    setIsFilterOpen(false);
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
  }

  const activeFilterCount = [
    filters.cattleType !== 'all',
    filters.disease !== 'All diseases',
    filters.ageMin !== '' || filters.ageMax !== '',
    filters.weightMin !== '' || filters.weightMax !== '',
    filters.teethCount !== '',
  ].filter(Boolean).length;

  const vaccineReportSummary = useMemo(() => {
    const today = new Date('2026-06-10T00:00:00');
    const completed = 8;
    const pending = vaccinationRecords.filter((record) => {
      const recordDate = new Date(`${record.date}T00:00:00`);
      return record.status === 'pending' && recordDate >= today;
    }).length;
    const overdue = 2;
    const nextDueRecord =
      vaccinationRecords
        .filter((record) => record.status === 'pending')
        .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

    return {
      completed,
      pending,
      overdue,
      nextDueText: nextDueRecord?.eligibleAnimalIds[0] ?? 'Cow A12',
    };
  }, [vaccinationRecords]);

  const filteredVaccines = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return vaccineCatalog.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.note.toLowerCase().includes(normalizedSearch);
      const matchesAnimal =
        selectedAnimalFilter === 'all' || item.supports.includes(selectedAnimalFilter);
      const matchesDisease = filters.disease === 'All diseases' || item.disease === filters.disease;
      const matchesAge = matchesRange(filters.ageMin, filters.ageMax, item.ageRangeMonths);
      const matchesWeight = matchesRange(filters.weightMin, filters.weightMax, item.weightRangeKg);
      const matchesTeeth = filters.teethCount === '' || item.teethCounts.includes(Number(filters.teethCount));

      return matchesSearch && matchesAnimal && matchesDisease && matchesAge && matchesWeight && matchesTeeth;
    });
  }, [filters, searchTerm, selectedAnimalFilter]);

  useEffect(() => {
    if (!isAnimalFilterMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!searchSegmentRef.current?.contains(event.target as Node)) {
        setIsAnimalFilterMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isAnimalFilterMenuOpen]);

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="h-[844px] overflow-y-auto px-6 pb-24 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => navigate('/farmer-dashboard')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <section className="mt-4 rounded-[24px] border border-[#DCE7DF] bg-white p-5 shadow-[0_10px_28px_rgba(38,70,45,0.06)]">
          <h2 className="text-[18px] font-extrabold text-[#17212B]">Vaccine Reports</h2>
          <p className="mt-1 text-[13px] font-medium text-[#6B7785]">
            Track completed, pending and overdue vaccines
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-[18px] border border-[#DCE7DF] bg-[#F7FCF9] px-3 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#4E9A72]">{vaccineReportSummary.completed}</p>
              <p className="mt-1 text-[12px] font-bold text-[#4E9A72]">Completed</p>
            </div>
            <div className="rounded-[18px] border border-[#F3E2B6] bg-[#FFF9EC] px-3 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#D79A17]">{vaccineReportSummary.pending}</p>
              <p className="mt-1 text-[12px] font-bold text-[#D79A17]">Pending</p>
            </div>
            <div className="rounded-[18px] border border-[#F3D0D0] bg-[#FFF7F7] px-3 py-4 text-center">
              <p className="text-[18px] font-extrabold text-[#D9544D]">{vaccineReportSummary.overdue}</p>
              <p className="mt-1 text-[12px] font-bold text-[#D9544D]">Overdue</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#F3FBF6] text-[#56A774]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="3.5" y="4.5" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6.5 2.8V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M13.5 2.8V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M3.5 8H16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-[#6B7785]">
                Next due: <span className="font-extrabold text-[#56A774]">{vaccineReportSummary.nextDueText}</span>{' '}
                tomorrow
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/vaccination-records')}
              className="rounded-full border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-2 text-sm font-bold text-[#56A774]"
            >
              View report
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#17212B]">All Vaccines</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/add-vaccine')}
              className="rounded-2xl bg-[#E6F7EF] px-4 py-2 text-xs font-bold text-[#1E9E6F]"
            >
              Add vaccine
            </button>
          </div>

          <div
            ref={searchSegmentRef}
            className={`mt-4 space-y-3 ${isAnimalFilterMenuOpen ? 'relative z-30' : ''}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search vaccines"
                className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none placeholder:text-[#6B7785]"
              />
              <button
                type="button"
                onClick={openFilterPanel}
                aria-label="Open filters"
                className="relative rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-[#17212B]"
              >
                <span className="flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 5H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M14 5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 10H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M10 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 15H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M16 15H16.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="14" cy="15" r="2" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                {activeFilterCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1E9E6F] text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>

            <div
              className={`-mx-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                isAnimalFilterMenuOpen ? 'overflow-visible' : 'overflow-x-auto'
              }`}
            >
              <div className="relative flex min-w-max gap-2 px-1 pb-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAnimalFilterMenuOpen((current) => !current)}
                    className="rounded-full border border-[#DCE7DF] bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B]"
                  >
                    {animalFilters.find((filter) => filter.value === selectedAnimalFilter)?.label ?? 'All'}
                  </button>

                  {isAnimalFilterMenuOpen ? (
                    <div className="absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-[20px] border border-[#DCE7DF] bg-[#17212B]/78 shadow-2xl backdrop-blur-md">
                      {animalFilters.map((filter) => {
                        const isActive = filter.value === selectedAnimalFilter;

                        return (
                          <button
                            key={filter.value}
                            type="button"
                            onClick={() => {
                              setSelectedAnimalFilter(filter.value);
                              setIsAnimalFilterMenuOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold ${
                              isActive ? 'text-white' : 'text-white/90'
                            }`}
                          >
                            <span className="w-3 text-white">{isActive ? '✓' : ''}</span>
                            <span>{filter.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {animalFilters
                  .filter((filter) => filter.value !== 'all')
                  .map((filter) => {
                    const isActive = selectedAnimalFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setSelectedAnimalFilter(filter.value)}
                        className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-[#1E9E6F] text-white'
                            : 'border border-[#DCE7DF] bg-[#F8FCFA] text-[#6B7785]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] bg-[#E6F7EF] px-4 py-3">
            <p className="text-lg font-black text-[#17212B]">{filteredVaccines.length}</p>
            <p className="text-[11px] font-bold text-[#6B7785]">vaccines available</p>
          </div>
        </section>

        <section
          className={`relative mt-5 space-y-3 ${isAnimalFilterMenuOpen ? 'blur-[5px] pointer-events-none' : ''}`}
        >
          {filteredVaccines.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openGiveVaccine(item.id)}
              className="w-full rounded-[22px] border border-[#DCE7DF] bg-white p-4 text-left transition-colors hover:border-[#1E9E6F]"
            >
              <div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#17212B]">{item.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#1E9E6F]">
                    {item.supports.join(', ')}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] bg-[#F8FCFA] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Dose</p>
                  <p className="mt-1 text-sm font-extrabold text-[#17212B]">{item.dose}</p>
                </div>
                <div className="rounded-[16px] bg-[#F8FCFA] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Schedule</p>
                  <p className="mt-1 text-sm font-extrabold text-[#17212B]">{item.schedule}</p>
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-[#6B7785]">{item.note}</p>
            </button>
          ))}

          {filteredVaccines.length === 0 ? (
            <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-5 text-center">
              <p className="text-sm font-extrabold text-[#17212B]">No vaccines found</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">
                Try a different search term or animal filter.
              </p>
            </div>
          ) : null}

          {isAnimalFilterMenuOpen ? (
            <button
              type="button"
              aria-label="Close vaccine animal filter menu"
              onClick={() => setIsAnimalFilterMenuOpen(false)}
              className="absolute inset-0 z-10 cursor-default"
            />
          ) : null}
        </section>
      </div>

      {isFilterOpen ? (
        <div className="absolute inset-0 z-40 bg-[#17212B]/20 px-3 py-6">
          <div className="mx-auto max-w-[360px] rounded-[28px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold text-[#17212B]">Filter</h2>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full bg-[#F8FCFA] px-3 py-2 text-sm font-bold text-[#17212B]"
              >
                X
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Cattle Type</label>
                <select
                  value={draftFilters.cattleType}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, cattleType: event.target.value as FilterState['cattleType'] })
                  }
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {animalFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Disease</label>
                <select
                  value={draftFilters.disease}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, disease: event.target.value as FilterState['disease'] })
                  }
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {diseaseOptions.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Age (Months)</label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    value={draftFilters.ageMin}
                    onChange={(event) => setDraftFilters({ ...draftFilters, ageMin: event.target.value })}
                    placeholder="Minimum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                  <input
                    value={draftFilters.ageMax}
                    onChange={(event) => setDraftFilters({ ...draftFilters, ageMax: event.target.value })}
                    placeholder="Maximum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ageChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          ageMin: String(chip.min),
                          ageMax: String(chip.max),
                        })
                      }
                      className="rounded-full border border-[#47A8C1] px-3 py-2 text-xs font-bold text-[#47A8C1]"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Weight (KG)</label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    value={draftFilters.weightMin}
                    onChange={(event) => setDraftFilters({ ...draftFilters, weightMin: event.target.value })}
                    placeholder="Minimum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                  <input
                    value={draftFilters.weightMax}
                    onChange={(event) => setDraftFilters({ ...draftFilters, weightMax: event.target.value })}
                    placeholder="Maximum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {weightChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          weightMin: String(chip.min),
                          weightMax: String(chip.max),
                        })
                      }
                      className="rounded-full border border-[#47A8C1] px-3 py-2 text-xs font-bold text-[#47A8C1]"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Teeth Count</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {teethOptions.map((count) => {
                    const isActive = draftFilters.teethCount === String(count);
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setDraftFilters({ ...draftFilters, teethCount: String(count) })}
                        className={`rounded-full border px-4 py-3 text-sm font-bold ${
                          isActive
                            ? 'border-[#47A8C1] bg-[#EAF7FB] text-[#47A8C1]'
                            : 'border-[#47A8C1] bg-white text-[#47A8C1]'
                        }`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-2xl border border-[#17212B] bg-white px-4 py-3 text-sm font-bold text-[#47A8C1]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="rounded-2xl bg-[#47A8C1] px-4 py-3 text-sm font-bold text-white"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
