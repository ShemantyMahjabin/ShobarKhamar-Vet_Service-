import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceModes, type ServiceMode, vets } from '../data/vetService';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const specialtyOptions = ['All specialties', ...new Set(vets.map((vet) => vet.specialty))] as const;
const availabilityOptions = ['All availability', ...new Set(vets.map((vet) => vet.availability))] as const;
const priceChips = [
  { label: 'BDT 400-500', min: 400, max: 500 },
  { label: 'BDT 500-600', min: 500, max: 600 },
  { label: 'BDT 600-700', min: 600, max: 700 },
] as const;

type VetFilters = {
  serviceType: 'all' | ServiceMode;
  specialty: (typeof specialtyOptions)[number];
  availability: (typeof availabilityOptions)[number];
  nearbyOnly: boolean;
  minPrice: string;
  maxPrice: string;
};

const defaultFilters: VetFilters = {
  serviceType: 'all',
  specialty: 'All specialties',
  availability: 'All availability',
  nearbyOnly: false,
  minPrice: '',
  maxPrice: '',
};

export function BookAppointment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<VetFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<VetFilters>(defaultFilters);

  function openFilterPanel() {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  }

  function applyFilters() {
    setFilters(draftFilters);
    setIsFilterOpen(false);
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
  }

  const activeFilterCount = [
    filters.serviceType !== 'all',
    filters.specialty !== 'All specialties',
    filters.availability !== 'All availability',
    filters.nearbyOnly,
    filters.minPrice !== '' || filters.maxPrice !== '',
  ].filter(Boolean).length;

  const filteredVets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return vets.filter((vet) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        vet.name.toLowerCase().includes(normalizedSearch) ||
        vet.specialty.toLowerCase().includes(normalizedSearch) ||
        vet.location.toLowerCase().includes(normalizedSearch);
      const matchesServiceType =
        filters.serviceType === 'all' || vet.serviceTypes.includes(filters.serviceType);
      const matchesSpecialty =
        filters.specialty === 'All specialties' || vet.specialty === filters.specialty;
      const matchesAvailability =
        filters.availability === 'All availability' || vet.availability === filters.availability;
      const matchesNearby =
        !filters.nearbyOnly ||
        vet.location.toLowerCase().includes('badda') ||
        vet.location.toLowerCase().includes('keraniganj');
      const matchesMinPrice = filters.minPrice === '' || vet.price >= Number(filters.minPrice);
      const matchesMaxPrice = filters.maxPrice === '' || vet.price <= Number(filters.maxPrice);

      return matchesSearch && matchesServiceType && matchesSpecialty && matchesAvailability && matchesNearby && matchesMinPrice && matchesMaxPrice;
    });
  }, [filters, searchTerm]);

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
          <h1 className="text-2xl font-extrabold text-[#17212B]">All Veterinarians</h1>
          <p className="mt-1 text-sm font-medium text-[#6B7785]">Search and filter the full veterinarian list.</p>
        </div>

        <section className="mt-5 space-y-3 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <div className="flex items-center gap-3">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search veterinarians"
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
        </section>

        <section className="mt-5 space-y-3">
          {filteredVets.map((vet) => (
            <button
              key={vet.id}
              type="button"
              onClick={() => navigate(`/booking/${vet.id}`)}
              className="w-full rounded-[22px] border border-[#DCE7DF] bg-white p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-[#17212B]">{vet.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#1E9E6F]">{vet.specialty}</p>
                  <p className="mt-1 text-[11px] font-medium text-[#6B7785]">{vet.location}</p>
                  <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${
                    vet.onlineStatus === 'online'
                      ? 'bg-[#E6F7EF] text-[#1E9E6F]'
                      : 'bg-[#F5F7F6] text-[#6B7785]'
                  }`}>
                    {vet.onlineStatus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#17212B]">BDT {vet.price}</p>
                  <p className="mt-1 text-[11px] font-bold text-[#F5A524]">Rating {vet.rating}</p>
                </div>
              </div>
            </button>
          ))}

          {filteredVets.length === 0 ? (
            <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-5 text-center">
              <p className="text-sm font-extrabold text-[#17212B]">No veterinarians found</p>
              <p className="mt-2 text-xs font-medium text-[#6B7785]">Try another search or filter combination.</p>
            </div>
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
                <label className="text-sm font-extrabold text-[#17212B]">Service Type</label>
                <select
                  value={draftFilters.serviceType}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, serviceType: event.target.value as VetFilters['serviceType'] })
                  }
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  <option value="all">All services</option>
                  {serviceModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Specialty</label>
                <select
                  value={draftFilters.specialty}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, specialty: event.target.value as VetFilters['specialty'] })
                  }
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {specialtyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Availability</label>
                <select
                  value={draftFilters.availability}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, availability: event.target.value as VetFilters['availability'] })
                  }
                  className="mt-3 w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Distance</label>
                <button
                  type="button"
                  onClick={() => setDraftFilters({ ...draftFilters, nearbyOnly: !draftFilters.nearbyOnly })}
                  className={`mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${
                    draftFilters.nearbyOnly
                      ? 'border-[#1E9E6F] bg-[#E6F7EF] text-[#1E9E6F]'
                      : 'border-[#DCE7DF] bg-[#F8FCFA] text-[#6B7785]'
                  }`}
                >
                  Nearby
                </button>
              </div>

              <div>
                <label className="text-sm font-extrabold text-[#17212B]">Consultation Fee</label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                    value={draftFilters.minPrice}
                    onChange={(event) => setDraftFilters({ ...draftFilters, minPrice: event.target.value })}
                    placeholder="Minimum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                  <input
                    value={draftFilters.maxPrice}
                    onChange={(event) => setDraftFilters({ ...draftFilters, maxPrice: event.target.value })}
                    placeholder="Maximum"
                    className="w-full rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#17212B] outline-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {priceChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        setDraftFilters({
                          ...draftFilters,
                          minPrice: String(chip.min),
                          maxPrice: String(chip.max),
                        })
                      }
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

      <MobileBottomNav active="vets" />
    </MobileShell>
  );
}
