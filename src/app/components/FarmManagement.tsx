import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAnimals, type AnimalRecord } from '../data/animals';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const animalTypeOptions = ['All', 'Cow', 'Goat', 'Buffalo', 'Sheep', 'Camel', 'Calf', 'Poultry', 'Others'] as const;
const statusOptions = ['All status', 'Registered', 'Healthy', 'Needs check', 'Recovered', 'Under review'] as const;
const ageChips = [
  { label: '0-12 months', min: 0, max: 12 },
  { label: '12-24 months', min: 12, max: 24 },
  { label: '24-36 months', min: 24, max: 36 },
  { label: '36-48 months', min: 36, max: 48 },
] as const;

function getAnimalType(animal: AnimalRecord) {
  if (animal.animalType) return animal.animalType;
  if (animal.id.startsWith('Cow')) return 'Cow';
  if (animal.id.startsWith('Goat')) return 'Goat';
  if (animal.id.startsWith('Calf')) return 'Calf';
  if (animal.id.startsWith('Poultry')) return 'Poultry';
  return 'Others';
}

function parseAgeToMonths(age: string) {
  const yearsMatch = age.match(/(\d+)\s*year/);
  const monthsMatch = age.match(/(\d+)\s*month/);
  const years = yearsMatch ? Number(yearsMatch[1]) : 0;
  const months = monthsMatch ? Number(monthsMatch[1]) : 0;
  return years * 12 + months;
}

function getAnimalInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function FarmManagement() {
  const navigate = useNavigate();
  const [animalRecords] = useState(() => getAllAnimals());
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [animalType, setAnimalType] = useState<(typeof animalTypeOptions)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All status');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  const filteredAnimals = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return animalRecords.filter((animal) => {
      const matchesType = animalType === 'All' || getAnimalType(animal) === animalType;
      const matchesStatus = statusFilter === 'All status' || animal.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        animal.id.toLowerCase().includes(normalizedSearch) ||
        animal.name.toLowerCase().includes(normalizedSearch) ||
        animal.breed.toLowerCase().includes(normalizedSearch) ||
        animal.note.toLowerCase().includes(normalizedSearch);
      const ageInMonths = parseAgeToMonths(animal.age);
      const matchesMinAge = ageMin === '' || ageInMonths >= Number(ageMin);
      const matchesMaxAge = ageMax === '' || ageInMonths <= Number(ageMax);

      return matchesType && matchesStatus && matchesSearch && matchesMinAge && matchesMaxAge;
    });
  }, [ageMax, ageMin, animalRecords, animalType, searchTerm, statusFilter]);

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

        <div className="mt-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#17212B]">My Livestock</h1>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => navigate('/add-animal')}
            className="rounded-2xl bg-[#1E9E6F] px-5 py-3 text-sm font-bold text-white"
          >
            Add animal
          </button>
        </div>

        <div className="mt-5 space-y-3 rounded-[20px] border border-[#DCE7DF] bg-white p-4">
          <div className="flex items-center gap-3">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search animals"
              className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none placeholder:text-[#6B7785]"
            />
            <button
              type="button"
              aria-label="Open filters"
              onClick={() => setIsFilterOpen(true)}
              className="rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-[#17212B]"
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
            </button>
          </div>

          <div className="-mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2 px-1 pb-1">
              <select
                value={animalType}
                onChange={(event) => setAnimalType(event.target.value as (typeof animalTypeOptions)[number])}
                className="rounded-full border border-[#DCE7DF] bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B] outline-none"
              >
                {animalTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {statusOptions
                .filter((option) => option !== 'All status')
                .map((option) => {
                  const isActive = statusFilter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStatusFilter(option)}
                      className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-[#1E9E6F] text-white'
                          : 'border border-[#DCE7DF] bg-[#F8FCFA] text-[#6B7785]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filteredAnimals.map((animal) => (
            <button
              key={animal.id}
              type="button"
              onClick={() => navigate(`/farm-management/${encodeURIComponent(animal.id)}`)}
              className="w-full rounded-[20px] border border-[#DCE7DF] bg-white p-4 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-[#DCE7DF] bg-[#E6F7EF]">
                  <AvatarFallback className="bg-[#E6F7EF] text-sm font-extrabold text-[#1E9E6F]">
                    {getAnimalInitials(animal.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-extrabold text-[#17212B]">{animal.name}</p>
                  <p className="mt-1 text-xs font-medium text-[#6B7785]">{animal.id}</p>
                </div>
              </div>
            </button>
          ))}

          {filteredAnimals.length === 0 ? (
            <div className="rounded-[20px] border border-[#DCE7DF] bg-white p-5 text-center">
              <p className="text-sm font-extrabold text-[#17212B]">No animals found</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">Try another search or filter combination.</p>
            </div>
          ) : null}
        </div>
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
                  value={animalType}
                  onChange={(event) => setAnimalType(event.target.value as (typeof animalTypeOptions)[number])}
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {animalTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Status</label>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])}
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Age (Months)</label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    value={ageMin}
                    onChange={(event) => setAgeMin(event.target.value)}
                    placeholder="Minimum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                  <input
                    value={ageMax}
                    onChange={(event) => setAgeMax(event.target.value)}
                    placeholder="Maximum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ageChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        setAgeMin(String(chip.min));
                        setAgeMax(String(chip.max));
                      }}
                      className="rounded-full border border-[#47A8C1] px-3 py-2 text-xs font-bold text-[#47A8C1]"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAnimalType('All');
                    setStatusFilter('All status');
                    setAgeMin('');
                    setAgeMax('');
                  }}
                  className="rounded-2xl border border-[#17212B] bg-white px-4 py-3 text-sm font-bold text-[#47A8C1]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-2xl bg-[#47A8C1] px-4 py-3 text-sm font-bold text-white"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
