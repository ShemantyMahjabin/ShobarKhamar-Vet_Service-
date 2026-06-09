import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

export function AddAnimal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    animalId: 'Cow A13',
    animalName: '',
    breed: '',
    age: '',
    status: 'Healthy',
    pregnancy: 'Not pregnant',
    note: '',
    description: '',
  });

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2">
        <button
          onClick={() => navigate('/farm-management')}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <h1 className="mt-4 text-2xl font-extrabold text-[#17212B]">Add Animal</h1>
        <p className="mt-1 text-sm font-medium text-[#6B7785]">
          Create a new livestock profile with breed, age, and health notes.
        </p>

        <div className="mt-5 space-y-4 rounded-[22px] border border-[#DCE7DF] bg-white p-4">
          <input
            value={form.animalId}
            onChange={(e) => setForm({ ...form, animalId: e.target.value })}
            placeholder="Animal ID"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />
          <input
            value={form.animalName}
            onChange={(e) => setForm({ ...form, animalName: e.target.value })}
            placeholder="Animal name"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />
          <input
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
            placeholder="Breed"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />
          <input
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            placeholder="Age"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          >
            <option>Healthy</option>
            <option>Needs check</option>
            <option>Recovered</option>
            <option>Under review</option>
          </select>
          <select
            value={form.pregnancy}
            onChange={(e) => setForm({ ...form, pregnancy: e.target.value })}
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          >
            <option>Not pregnant</option>
            <option>Pregnant</option>
            <option>Pregnancy unknown</option>
          </select>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Short note"
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Animal description"
            rows={4}
            className="w-full rounded-xl border border-[#DCE7DF] px-4 py-3 text-sm text-[#17212B] focus:outline-none resize-none"
          />
        </div>

        <div className="mt-5 rounded-[22px] bg-[#EAF3FB] p-4">
          <p className="text-sm font-extrabold text-[#17212B]">Preview</p>
          <p className="mt-2 text-sm font-bold text-[#17212B]">
            {form.animalId} {form.animalName ? `• ${form.animalName}` : ''}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#6B7785]">
            {[form.breed, form.age].filter(Boolean).join(' • ') || 'Breed and age will appear here'}
          </p>
          <p className="mt-2 text-xs font-semibold text-[#0F4C81]">Pregnancy: {form.pregnancy}</p>
          <p className="mt-2 text-xs font-medium text-[#17212B]">
            {form.description || 'Description preview will appear here.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/farm-management')}
          className="mt-5 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
        >
          Save animal
        </button>
      </div>

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
