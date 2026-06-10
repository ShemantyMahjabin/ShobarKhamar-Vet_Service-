import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVetConsultationStore } from '../data/vetConsultation';
import { serviceModes, type ServiceMode, vets } from '../data/vetService';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

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

type AppointmentStatus = 'accepted' | 'pending' | 'cancelled';

type AppointmentItem = {
  id: number;
  vetName: string;
  animalNames: string;
  date: string;
  time: string;
  center: string;
  mode: 'In Person' | 'Video consultation' | 'Request vet to visit';
  status: AppointmentStatus;
  additionalCharge?: number;
};

const initialAppointments: AppointmentItem[] = [
  {
    id: 1,
    vetName: 'Dr. Nadia Islam',
    animalNames: 'Cow A12, Goat G08',
    date: '2026-06-12',
    time: '11:30 AM - 12:30 PM',
    center: 'Badda Livestock Care',
    mode: 'In Person',
    status: 'accepted',
  },
  {
    id: 2,
    vetName: 'Dr. Mahmud Hasan',
    animalNames: 'Calf C03',
    date: '2026-06-15',
    time: '3:00 PM - 3:30 PM',
    center: 'Video consultation',
    mode: 'Video consultation',
    status: 'pending',
  },
  {
    id: 3,
    vetName: 'Dr. Farhana Akter',
    animalNames: 'Goat G05',
    date: '2026-06-11',
    time: '10:00 AM - 11:00 AM',
    center: 'Farm visit',
    mode: 'Request vet to visit',
    status: 'accepted',
  },
] as const;

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatStatus(status: AppointmentStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function BookAppointment() {
  const navigate = useNavigate();
  const { presence } = useVetConsultationStore();
  const [activeSection, setActiveSection] = useState<'book' | 'schedule'>('book');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<VetFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<VetFilters>(defaultFilters);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [message, setMessage] = useState('');
  const [showRescheduleWarning, setShowRescheduleWarning] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [pendingReschedule, setPendingReschedule] = useState<{ id: number; vetName: string; hoursRemaining: number } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{ id: number; hoursRemaining: number } | null>(null);

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

  const activeAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status !== 'cancelled'),
    [appointments],
  );

  function calculateHoursRemaining(appointmentDate: string): number {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T00:00:00`);
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }

  function proceedWithReschedule(vetName: string) {
    const vet = vets.find((item) => item.name === vetName);
    if (vet) {
      navigate(`/booking/${vet.id}`);
    }
  }

  function handleReschedule(id: number, vetName: string, mode: string, appointmentDate: string) {
    if (mode === 'Request vet to visit') {
      const hoursRemaining = calculateHoursRemaining(appointmentDate);
      if (hoursRemaining < 24) {
        setPendingReschedule({ id, vetName, hoursRemaining });
        setShowRescheduleWarning(true);
        return;
      }
    }

    proceedWithReschedule(vetName);
  }

  function proceedWithCancel(id: number) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment,
      ),
    );
    setMessage('Appointment cancelled successfully.');
  }

  function handleCancel(id: number, mode: string, appointmentDate: string) {
    if (mode === 'Request vet to visit') {
      const hoursRemaining = calculateHoursRemaining(appointmentDate);
      if (hoursRemaining < 24) {
        setPendingCancel({ id, hoursRemaining });
        setShowCancelWarning(true);
        return;
      }
    }

    proceedWithCancel(id);
  }

  function handleConfirmReschedule() {
    if (!pendingReschedule) return;

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === pendingReschedule.id ? { ...appointment, additionalCharge: 100 } : appointment,
      ),
    );
    localStorage.setItem('rescheduleCharge', '100');
    proceedWithReschedule(pendingReschedule.vetName);
    setShowRescheduleWarning(false);
    setPendingReschedule(null);
  }

  function handleCancelReschedule() {
    setShowRescheduleWarning(false);
    setPendingReschedule(null);
  }

  function handleConfirmCancel() {
    if (!pendingCancel) return;

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === pendingCancel.id
          ? { ...appointment, status: 'cancelled', additionalCharge: 100 }
          : appointment,
      ),
    );
    setMessage('Appointment cancelled. A ৳100 fee will be deducted from your account.');
    setShowCancelWarning(false);
    setPendingCancel(null);
  }

  function handleCancelCancel() {
    setShowCancelWarning(false);
    setPendingCancel(null);
  }

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="flex h-full flex-col overflow-hidden pb-24">
        <div className="px-6 pt-2">
          <button
            onClick={() => navigate('/farmer-dashboard')}
            className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
          >
            Back
          </button>

          <div className="mt-4">
            <h1 className="text-2xl font-extrabold text-[#17212B]">Vet</h1>
          </div>

          <section className="mt-5">
            <div className="grid grid-cols-2 gap-2.5 rounded-[20px] bg-[#f8faf8] p-2">
              <button
                type="button"
                onClick={() => setActiveSection('book')}
                className={`min-h-[58px] rounded-[18px] px-3 py-2.5 text-[13px] font-black leading-tight ${
                  activeSection === 'book' ? 'bg-[#27a36a] text-white' : 'bg-white text-[#69716b]'
                }`}
              >
                Book a Vet
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('schedule')}
                className={`min-h-[58px] rounded-[18px] px-3 py-2.5 text-[13px] font-black leading-tight ${
                  activeSection === 'schedule' ? 'bg-[#27a36a] text-white' : 'bg-white text-[#69716b]'
                }`}
              >
                Appointment Schedule
              </button>
            </div>
          </section>

          {activeSection === 'schedule' && message ? (
            <section className="mt-5 rounded-[18px] border border-[#DCE7DF] bg-[#EAF7EF] px-4 py-3">
              <p className="text-sm font-bold text-[#1E9E6F]">{message}</p>
            </section>
          ) : null}

          {activeSection === 'book' ? (
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
          ) : null}
        </div>

        <div className="mt-5 flex-1 overflow-y-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section className="space-y-3">
            {activeSection === 'book' ? (
              <>
                {filteredVets.map((vet) => (
                  (() => {
                    const onlineStatus = presence[vet.id] ?? vet.onlineStatus;

                    return (
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
                              onlineStatus === 'online'
                                ? 'bg-[#E6F7EF] text-[#1E9E6F]'
                                : 'bg-[#F5F7F6] text-[#6B7785]'
                            }`}>
                              {onlineStatus}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-[#17212B]">BDT {vet.price}</p>
                            <p className="mt-1 text-[11px] font-bold text-[#F5A524]">Rating {vet.rating}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })()
                ))}

                {filteredVets.length === 0 ? (
                  <div className="rounded-[22px] border border-[#DCE7DF] bg-white p-5 text-center">
                    <p className="text-sm font-extrabold text-[#17212B]">No veterinarians found</p>
                    <p className="mt-2 text-xs font-medium text-[#6B7785]">Try another search or filter combination.</p>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {activeAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-extrabold text-[#17212B]">{appointment.vetName}</p>
                        <p className="mt-1 text-sm font-semibold text-[#6B7785]">{appointment.mode}</p>
                      </div>
                      <div className={`rounded-2xl px-3 py-2 text-xs font-bold ${
                        appointment.status === 'accepted'
                          ? 'bg-[#EAF7EF] text-[#1E9E6F]'
                          : 'bg-[#FEF3E2] text-[#B8860B]'
                      }`}>
                        {formatStatus(appointment.status)}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 rounded-[18px] bg-white p-4">
                      <p className="text-sm font-bold text-[#17212B]">{formatDate(appointment.date)}</p>
                      <p className="text-sm font-medium text-[#6B7785]">{appointment.time}</p>
                      <p className="text-sm font-medium text-[#6B7785]">{appointment.center}</p>
                      <p className="text-sm font-medium text-[#6B7785]">Animals: {appointment.animalNames}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleReschedule(appointment.id, appointment.vetName, appointment.mode, appointment.date)}
                        className="rounded-[18px] bg-[#56A774] px-4 py-3 text-sm font-bold text-white"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(appointment.id, appointment.mode, appointment.date)}
                        className="rounded-[18px] border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}

                {activeAppointments.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#DCE7DF] bg-[#F8FCFA] px-4 py-8 text-center">
                    <p className="text-sm font-bold text-[#17212B]">No appointments yet</p>
                    <p className="mt-1 text-xs font-medium text-[#6B7785]">
                      Book an appointment to see it here.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </section>
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

      <AlertDialog open={showRescheduleWarning} onOpenChange={setShowRescheduleWarning}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-extrabold text-[#17212B]">Reschedule Fee Notice</AlertDialogTitle>
            <AlertDialogDescription className="mt-3 space-y-3 text-sm">
              <p className="text-[#6B7785]">
                Rescheduling within 24 hours of your appointment incurs a fee.
              </p>
              <div className="rounded-[12px] bg-[#FEF3E2] p-3">
                <p className="font-semibold text-[#B8860B]">Reschedule Fee: ৳100 (20% of appointment cost)</p>
                <p className="mt-1 text-xs text-[#B8860B]">This amount will be added to your next appointment.</p>
              </div>
              <p className="text-[#6B7785]">Do you want to proceed with rescheduling?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel
              onClick={handleCancelReschedule}
              className="flex-1 rounded-[12px] border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B] hover:bg-[#F8FCFA]"
            >
              No, Keep Current
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReschedule}
              className="flex-1 rounded-[12px] bg-[#56A774] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A945C]"
            >
              Yes, Reschedule
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelWarning} onOpenChange={setShowCancelWarning}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-extrabold text-[#17212B]">Cancellation Fee Notice</AlertDialogTitle>
            <AlertDialogDescription className="mt-3 space-y-3 text-sm">
              <p className="text-[#6B7785]">
                Cancelling within 24 hours of your appointment incurs a fee.
              </p>
              <div className="rounded-[12px] bg-[#FEF3E2] p-3">
                <p className="font-semibold text-[#B8860B]">Cancellation Fee: ৳100 (20% of appointment cost)</p>
                <p className="mt-1 text-xs text-[#B8860B]">This amount will be deducted from your account.</p>
              </div>
              <p className="text-[#6B7785]">Do you want to proceed with cancellation?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel
              onClick={handleCancelCancel}
              className="flex-1 rounded-[12px] border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B] hover:bg-[#F8FCFA]"
            >
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="flex-1 rounded-[12px] bg-[#DC2626] px-4 py-3 text-sm font-bold text-white hover:bg-[#B91C1C]"
            >
              Yes, Cancel
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <MobileBottomNav active="vets" />
    </MobileShell>
  );
}
