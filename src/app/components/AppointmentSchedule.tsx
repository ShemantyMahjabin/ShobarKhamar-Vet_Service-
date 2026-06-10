import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vets } from '../data/vetService';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

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
];

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function AppointmentSchedule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [message, setMessage] = useState('');
  const [showRescheduleWarning, setShowRescheduleWarning] = useState(false);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [pendingReschedule, setPendingReschedule] = useState<{ id: number; vetName: string; hoursRemaining: number } | null>(null);
  const [pendingCancel, setPendingCancel] = useState<{ id: number; hoursRemaining: number } | null>(null);
  const appointmentIdParam = searchParams.get('appointmentId');
  const selectedAppointmentId = appointmentIdParam ? Number(appointmentIdParam) : null;

  const activeAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status !== 'cancelled'),
    [appointments],
  );

  const visibleAppointments = useMemo(() => {
    if (selectedAppointmentId === null || !Number.isFinite(selectedAppointmentId)) {
      return activeAppointments;
    }

    const matchedAppointment = activeAppointments.find((appointment) => appointment.id === selectedAppointmentId);
    return matchedAppointment ? [matchedAppointment] : activeAppointments;
  }, [activeAppointments, selectedAppointmentId]);

  function calculateHoursRemaining(appointmentDate: string): number {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T00:00:00`);
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
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

    // Proceed with reschedule for free
    proceedWithReschedule(vetName);
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

    // Proceed with cancellation for free
    proceedWithCancel(id);
  }

  function proceedWithReschedule(vetName: string) {
    const vet = vets.find((v) => v.name === vetName);
    if (vet) {
      navigate(`/booking/${vet.id}`);
    }
  }

  function handleConfirmReschedule() {
    if (pendingReschedule) {
      // Add charge to the appointment
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === pendingReschedule.id
            ? { ...appointment, additionalCharge: 100 }
            : appointment,
        ),
      );
      
      // Store the charge in localStorage so VetProfile can show it
      localStorage.setItem('rescheduleCharge', '100');
      
      proceedWithReschedule(pendingReschedule.vetName);
      setShowRescheduleWarning(false);
      setPendingReschedule(null);
    }
  }

  function handleCancelReschedule() {
    setShowRescheduleWarning(false);
    setPendingReschedule(null);
  }

  function handleConfirmCancel() {
    if (pendingCancel) {
      // Add charge and cancel the appointment
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
  }

  function handleCancelCancel() {
    setShowCancelWarning(false);
    setPendingCancel(null);
  }

  function proceedWithCancel(id: number) {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'cancelled' } : appointment,
      ),
    );
    setMessage('Appointment cancelled successfully.');
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
          <h1 className="text-2xl font-extrabold text-[#17212B]">
            {selectedAppointmentId !== null && Number.isFinite(selectedAppointmentId) ? 'Appointment Details' : 'Appointment Schedule'}
          </h1>
        </section>

        {message ? (
          <section className="mt-4 rounded-[18px] border border-[#DCE7DF] bg-[#EAF7EF] px-4 py-3">
            <p className="text-sm font-bold text-[#1E9E6F]">{message}</p>
          </section>
        ) : null}

        <section className="mt-5 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <div className="mt-4 space-y-4">
            {visibleAppointments.length > 0 ? (
              visibleAppointments.map((appointment) => (
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
                      {appointment.status === 'accepted' ? 'Accepted' : 'Pending'}
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
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#DCE7DF] bg-[#F8FCFA] px-4 py-8 text-center">
                <p className="text-sm font-bold text-[#17212B]">
                  {selectedAppointmentId !== null && Number.isFinite(selectedAppointmentId) ? 'Appointment not found' : 'No appointments yet'}
                </p>
                <p className="mt-1 text-xs font-medium text-[#6B7785]">
                  {selectedAppointmentId !== null && Number.isFinite(selectedAppointmentId)
                    ? 'This appointment is no longer available.'
                    : 'Book an appointment to see it here.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

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
            <AlertDialogCancel onClick={handleCancelReschedule} className="flex-1 rounded-[12px] border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B] hover:bg-[#F8FCFA]">
              No, Keep Current
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReschedule} className="flex-1 rounded-[12px] bg-[#56A774] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A945C]">
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
            <AlertDialogCancel onClick={handleCancelCancel} className="flex-1 rounded-[12px] border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#17212B] hover:bg-[#F8FCFA]">
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="flex-1 rounded-[12px] bg-[#DC2626] px-4 py-3 text-sm font-bold text-white hover:bg-[#B91C1C]">
              Yes, Cancel
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
