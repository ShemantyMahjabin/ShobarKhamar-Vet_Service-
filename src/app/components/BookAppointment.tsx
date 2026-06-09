import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animals } from '../data/animals';
import { serviceModes, type ServiceMode, vets } from '../data/vetService';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function BookAppointment() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<ServiceMode>('farm-visit');
  const [selectedAnimal, setSelectedAnimal] = useState(animals[0].id);
  const [selectedVetId, setSelectedVetId] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState('2026-06-09');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  const filteredVets = useMemo(
    () => vets.filter((vet) => vet.serviceTypes.includes(selectedMode)),
    [selectedMode],
  );

  const selectedVet = filteredVets.find((vet) => vet.id === selectedVetId) ?? filteredVets[0];
  const selectedAnimalRecord = animals.find((animal) => animal.id === selectedAnimal) ?? animals[0];
  const total = (selectedVet?.price ?? 0) + 60;

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

        <h1 className="mt-4 text-2xl font-extrabold text-[#17212B]">Find a Vet</h1>
        <p className="mt-1 text-sm font-medium text-[#6B7785]">Search by service type and consultation fee.</p>

        <div className="mt-5 space-y-4">
          <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="text-base font-extrabold text-[#17212B]">Service type</h2>
            <div className="mt-3 space-y-3">
              {serviceModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedMode(mode.id);
                    const nextVet = vets.find((vet) => vet.serviceTypes.includes(mode.id));
                    if (nextVet) setSelectedVetId(nextVet.id);
                  }}
                  className={`w-full rounded-[18px] border p-4 text-left ${
                    selectedMode === mode.id ? 'border-[#1E9E6F] bg-[#E6F7EF]' : 'border-[#DCE7DF] bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#17212B]">{mode.title}</p>
                      <p className="mt-1 text-xs font-medium text-[#6B7785]">{mode.description}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${mode.badgeClass}`}>{mode.eta}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="text-base font-extrabold text-[#17212B]">Animal details</h2>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="mt-3 w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
            >
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.id}
                </option>
              ))}
            </select>
            <div className="mt-3 rounded-[18px] bg-[#F8FCFA] p-4">
              <p className="text-sm font-extrabold text-[#17212B]">{selectedAnimalRecord.id} • {selectedAnimalRecord.name}</p>
              <p className="mt-1 text-xs font-semibold text-[#6B7785]">{selectedAnimalRecord.breed} • {selectedAnimalRecord.age}</p>
              <p className="mt-2 text-xs font-medium text-[#17212B]">{selectedAnimalRecord.description}</p>
            </div>
          </section>

          <section className="rounded-[22px] border border-[#DCE7DF] bg-white p-4">
            <h2 className="text-base font-extrabold text-[#17212B]">Available veterinarians</h2>
            <div className="mt-3 space-y-3">
              {filteredVets.map((vet) => (
                <button
                  key={vet.id}
                  onClick={() => setSelectedVetId(vet.id)}
                  className={`w-full rounded-[18px] border p-4 text-left ${
                    selectedVet?.id === vet.id ? 'border-[#1E9E6F] bg-[#F8FCFA]' : 'border-[#DCE7DF] bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#17212B]">{vet.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#6B7785]">{vet.specialty}</p>
                      <p className="mt-1 text-[11px] font-medium text-[#6B7785]">{vet.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-[#1E9E6F]">BDT {vet.price}</p>
                      <p className="text-[11px] font-bold text-[#F5A524]">Rating {vet.rating}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] bg-[#17212B] p-5 text-white">
            <h2 className="text-base font-extrabold">Booking summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p>Mode: {serviceModes.find((mode) => mode.id === selectedMode)?.title}</p>
              <p>Vet: {selectedVet?.name}</p>
              <p>Animal: {selectedAnimalRecord.id}</p>
              <p>Date: {selectedDate}</p>
              <p>Time: {selectedTime}</p>
              <p>Total: BDT {total}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-xs text-white outline-none"
              />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-xs text-white outline-none"
              >
                <option className="text-black">10:00 AM</option>
                <option className="text-black">11:30 AM</option>
                <option className="text-black">02:00 PM</option>
                <option className="text-black">04:00 PM</option>
              </select>
            </div>

            <button
              onClick={() => navigate('/diagnosis-report')}
              className="mt-4 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
            >
              Confirm and continue
            </button>
          </section>
        </div>
      </div>

      <MobileBottomNav active="vets" />
    </MobileShell>
  );
}
