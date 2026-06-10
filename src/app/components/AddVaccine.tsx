import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const animalOptions = ['Cow', 'Cattle', 'Calf', 'Goat', 'Poultry'];
const diseaseOptions = ['None', 'Fever', 'Diarrhea', 'Respiratory infection', 'Skin infection'];
const pregnancyOptions = ['None', 'Pregnant'];
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

export function AddVaccine() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    centerName: '',
    doseNumber: '',
    doseQuantity: '',
    scheduleDays: '',
    boosterInterval: '',
    animal: animalOptions[0],
    reason: '',
    sideEffects: '',
    restrictedDisease: diseaseOptions[0],
    pregnancyStatus: pregnancyOptions[0],
    minAge: '',
    maxAge: '',
    minWeight: '',
    maxWeight: '',
    teethCount: '',
  });

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2">
        <button
          onClick={() => navigate('/vaccination-management')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-extrabold text-[#17212B]">Add Vaccine</h1>
        </div>

        <div className="mt-5 space-y-4 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Vaccine name"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />

          <input
            value={form.centerName}
            onChange={(event) => setForm({ ...form, centerName: event.target.value })}
            placeholder="Center name"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.doseNumber}
              onChange={(event) => setForm({ ...form, doseNumber: event.target.value })}
              placeholder="Dose number"
              className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
            />
            <input
              value={form.doseQuantity}
              onChange={(event) => setForm({ ...form, doseQuantity: event.target.value })}
              placeholder="Dose quantity"
              className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.scheduleDays}
              onChange={(event) => setForm({ ...form, scheduleDays: event.target.value })}
              placeholder="Schedule in days"
              className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
            />
            <input
              value={form.boosterInterval}
              onChange={(event) => setForm({ ...form, boosterInterval: event.target.value })}
              placeholder="Booster interval"
              className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
            />
          </div>

          <select
            value={form.animal}
            onChange={(event) => setForm({ ...form, animal: event.target.value })}
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          >
            {animalOptions.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>

          <textarea
            value={form.reason}
            onChange={(event) => setForm({ ...form, reason: event.target.value })}
            placeholder="Reason provided (optional)"
            rows={3}
            className="w-full resize-none rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />

          <textarea
            value={form.sideEffects}
            onChange={(event) => setForm({ ...form, sideEffects: event.target.value })}
            placeholder="Side effects (optional)"
            rows={3}
            className="w-full resize-none rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />

          <div className="rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
            <p className="text-sm font-extrabold text-[#17212B]">Age</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                value={form.minAge}
                onChange={(event) => setForm({ ...form, minAge: event.target.value })}
                placeholder="Minimum"
                className="w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
              />
              <input
                value={form.maxAge}
                onChange={(event) => setForm({ ...form, maxAge: event.target.value })}
                placeholder="Maximum"
                className="w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ageChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setForm({ ...form, minAge: String(chip.min), maxAge: String(chip.max) })}
                  className="rounded-full border border-[#47A8C1] px-3 py-2 text-xs font-bold text-[#47A8C1]"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
            <p className="text-sm font-extrabold text-[#17212B]">Weight (KG)</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                value={form.minWeight}
                onChange={(event) => setForm({ ...form, minWeight: event.target.value })}
                placeholder="Minimum"
                className="w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
              />
              <input
                value={form.maxWeight}
                onChange={(event) => setForm({ ...form, maxWeight: event.target.value })}
                placeholder="Maximum"
                className="w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {weightChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setForm({ ...form, minWeight: String(chip.min), maxWeight: String(chip.max) })}
                  className="rounded-full border border-[#47A8C1] px-3 py-2 text-xs font-bold text-[#47A8C1]"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
            <p className="text-sm font-extrabold text-[#17212B]">Teeth Count</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {teethOptions.map((count) => {
                const isActive = form.teethCount === String(count);
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setForm({ ...form, teethCount: String(count) })}
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

          <div className="rounded-[20px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-[#17212B]">Critical condition</p>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#6B7785]">Optional</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Animal status</label>
                <select
                  value={form.pregnancyStatus}
                  onChange={(event) => setForm({ ...form, pregnancyStatus: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
                >
                  {pregnancyOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B7785]">Disease</label>
                <select
                  value={form.restrictedDisease}
                  onChange={(event) => setForm({ ...form, restrictedDisease: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm text-[#17212B] focus:outline-none"
                >
                  {diseaseOptions.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease === 'None' ? 'Select disease' : disease}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] bg-[#EAF3FB] p-4">
          <p className="text-sm font-extrabold text-[#17212B]">Preview</p>
          <p className="mt-2 text-sm font-bold text-[#17212B]">{form.name || 'Vaccine name'}</p>
          <p className="mt-1 text-xs font-semibold text-[#6B7785]">
            {[form.animal, form.scheduleDays ? `${form.scheduleDays} days` : '', form.centerName].filter(Boolean).join(' • ') ||
              'Animal, schedule, and center will appear here'}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Dose: {[form.doseNumber, form.doseQuantity].filter(Boolean).join(' • ') || 'Dose details'}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Booster: {form.boosterInterval || 'Not set'} • Pregnancy: {form.pregnancyStatus}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Disease restriction: {form.restrictedDisease}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Age: {[form.minAge && `Min ${form.minAge}`, form.maxAge && `Max ${form.maxAge}`].filter(Boolean).join(' • ') || 'Not set'}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Weight: {[form.minWeight && `Min ${form.minWeight}`, form.maxWeight && `Max ${form.maxWeight}`].filter(Boolean).join(' • ') || 'Not set'}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">
            Teeth: {form.teethCount || 'Not set'}
          </p>
          <p className="mt-2 text-xs font-medium text-[#17212B]">
            {form.reason || 'Optional reason or note will appear here.'}
          </p>
          <p className="mt-2 text-xs font-medium text-[#17212B]">
            {form.sideEffects || 'Optional side effects will appear here.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/vaccination-management')}
          className="mt-5 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
        >
          Save vaccine
        </button>
      </div>

      <MobileBottomNav active="more" />
    </MobileShell>
  );
}
