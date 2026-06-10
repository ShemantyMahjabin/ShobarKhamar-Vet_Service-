import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';
import { getAllAnimals, type AnimalRecord } from '../data/animals';
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

const animalImageByType: Record<string, string> = {
  Cow: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=520&h=300&fit=crop&auto=format',
  Goat: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=520&h=300&fit=crop&auto=format',
  Buffalo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=520&h=300&fit=crop&auto=format',
  Sheep: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=520&h=300&fit=crop&auto=format',
  Camel: 'https://images.unsplash.com/photo-1489161587020-79aa193f04ff?w=520&h=300&fit=crop&auto=format',
  Calf: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=520&h=300&fit=crop&auto=format',
  Poultry: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=520&h=300&fit=crop&auto=format',
  Others: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=520&h=300&fit=crop&auto=format',
};

const previewAnimalCount = 5;

function getAnimalType(animal: AnimalRecord) {
  if (animal.animalType) return animal.animalType;
  if (animal.id.startsWith('Cow')) return 'Cow';
  if (animal.id.startsWith('Goat')) return 'Goat';
  if (animal.id.startsWith('Buffalo')) return 'Buffalo';
  if (animal.id.startsWith('Sheep')) return 'Sheep';
  if (animal.id.startsWith('Camel')) return 'Camel';
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

function getAnimalImage(animal: AnimalRecord) {
  const mediaFile = animal.mediaFiles?.[0];

  if (typeof mediaFile === 'string' && mediaFile) {
    return mediaFile;
  }

  if (typeof mediaFile === 'object' && mediaFile?.url) {
    return mediaFile.url;
  }

  return animalImageByType[getAnimalType(animal)] ?? animalImageByType.Others;
}

function getStatusTone(status: string) {
  if (status === 'Healthy' || status === 'Registered' || status === 'Recovered') {
    return 'bg-emerald-50 text-[#529864]';
  }

  if (status === 'Needs check') {
    return 'bg-amber-50 text-amber-600';
  }

  return 'bg-sky-50 text-sky-600';
}

export function FarmManagement() {
  const navigate = useNavigate();
  const searchSegmentRef = useRef<HTMLDivElement | null>(null);
  const [animalRecords] = useState(() => getAllAnimals());
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnimalTypeMenuOpen, setIsAnimalTypeMenuOpen] = useState(false);
  const [animalType, setAnimalType] = useState<(typeof animalTypeOptions)[number]>('All');
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('All status');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [showAllAnimals, setShowAllAnimals] = useState(false);

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

  const visibleAnimals = showAllAnimals ? filteredAnimals : filteredAnimals.slice(0, previewAnimalCount);
  const hiddenAnimalCount = Math.max(filteredAnimals.length - previewAnimalCount, 0);

  useEffect(() => {
    if (!isAnimalTypeMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!searchSegmentRef.current?.contains(event.target as Node)) {
        setIsAnimalTypeMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isAnimalTypeMenuOpen]);

  useEffect(() => {
    setShowAllAnimals(false);
  }, [ageMax, ageMin, animalType, searchTerm, statusFilter]);

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="relative px-6 pt-2">
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

        <div
          ref={searchSegmentRef}
          className={`mt-5 space-y-3 rounded-[20px] border border-[#DCE7DF] bg-white p-4 transition ${
            isAnimalTypeMenuOpen ? 'relative z-30' : ''
          }`}
        >
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

          <div
            className={`-mx-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isAnimalTypeMenuOpen ? 'overflow-visible' : 'overflow-x-auto'
            }`}
          >
            <div className="relative flex min-w-max gap-2 px-1 pb-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAnimalTypeMenuOpen((current) => !current)}
                  className="rounded-full border border-[#DCE7DF] bg-[#F8FCFA] px-3 py-2 text-xs font-bold text-[#17212B]"
                >
                  {animalType}
                </button>

                {isAnimalTypeMenuOpen ? (
                  <div className="absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-[20px] border border-[#DCE7DF] bg-[#17212B]/78 shadow-2xl backdrop-blur-md">
                    {animalTypeOptions.map((option) => {
                      const isActive = option === animalType;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setAnimalType(option);
                            setIsAnimalTypeMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-bold ${
                            isActive ? 'text-white' : 'text-white/90'
                          }`}
                        >
                          <span className="w-3 text-white">{isActive ? '✓' : ''}</span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
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

        <div className={`relative mt-5 transition ${isAnimalTypeMenuOpen ? 'blur-[5px] pointer-events-none' : ''}`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#8a908a]">Animals</p>
              <p className="mt-1 text-sm font-black text-[#202720]">
                Showing {visibleAnimals.length} of {filteredAnimals.length}
              </p>
            </div>
            {hiddenAnimalCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowAllAnimals((current) => !current)}
                className="rounded-[14px] bg-[#3d7f52] px-4 py-3 text-xs font-black text-white shadow-sm transition active:scale-[0.98]"
              >
                {showAllAnimals ? 'Show Less' : 'Show All'}
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 pb-4">
            {visibleAnimals.map((animal) => (
              <button
                key={animal.id}
                type="button"
                onClick={() => navigate(`/farm-management/${encodeURIComponent(animal.id)}`)}
                className="overflow-hidden rounded-[18px] border border-[#e3e9e5] bg-white text-left shadow-[0_8px_18px_rgba(42,72,48,0.08)] transition active:scale-[0.99]"
              >
                <div className="relative h-[110px] bg-emerald-100">
                  <img src={getAnimalImage(animal)} alt={animal.name} className="h-full w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-white/85 px-2 py-1 text-[9px] font-black text-[#4b9463] backdrop-blur">
                    {getAnimalType(animal)}
                  </span>
                  <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur">
                    <Heart className="h-5 w-5 fill-transparent stroke-white drop-shadow" />
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-black leading-tight text-[#202720]">{animal.name}</h3>
                      <p className="mt-1 truncate text-[11px] font-bold text-[#6f7771]">{animal.breed} • {animal.age}</p>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#9aa29c]" />
                  </div>
                  <p className="mt-2 truncate text-[11px] font-bold text-[#6f7771]">{animal.note}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="truncate text-[12px] font-black text-[#4b9463]">{animal.id}</p>
                    <span className={`shrink-0 rounded px-2 py-1 text-[9px] font-black ${getStatusTone(animal.status)}`}>
                      {animal.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredAnimals.length === 0 ? (
            <div className="rounded-[20px] border border-[#DCE7DF] bg-white p-5 text-center">
              <p className="text-sm font-extrabold text-[#17212B]">No animals found</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">Try another search or filter combination.</p>
            </div>
          ) : null}

          {isAnimalTypeMenuOpen ? (
            <button
              type="button"
              aria-label="Close animal type menu"
              onClick={() => setIsAnimalTypeMenuOpen(false)}
              className="absolute inset-0 z-10 cursor-default"
            />
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
