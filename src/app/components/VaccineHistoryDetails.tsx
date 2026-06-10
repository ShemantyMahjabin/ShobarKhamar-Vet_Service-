import { useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllAnimals, saveAnimalRecord, type AnimalRecord, type VaccineSideEffectRecord } from '../data/animals';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

function valueOrDash(value: string | undefined) {
  return value && value.trim() ? value : '-';
}

function getVaccineSideEffects(
  vaccine: NonNullable<AnimalRecord['vaccineHistory']>[number],
): VaccineSideEffectRecord[] {
  if (vaccine.sideEffects?.length) {
    return vaccine.sideEffects;
  }

  if (vaccine.sideEffect || vaccine.sideEffectImageName || vaccine.sideEffectImageUrl) {
    return [
      {
        description: vaccine.sideEffect || '',
        date: '',
        mediaName: vaccine.sideEffectImageName || '',
        mediaUrl: vaccine.sideEffectImageUrl,
        mediaType: vaccine.sideEffectImageType || '',
      },
    ];
  }

  return [];
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function VaccineHistoryDetails() {
  const navigate = useNavigate();
  const { animalId, vaccineIndex } = useParams();
  const decodedAnimalId = animalId ? decodeURIComponent(animalId) : '';
  const initialAnimal = getAllAnimals().find((item) => item.id === decodedAnimalId) ?? null;
  const [animal, setAnimal] = useState(initialAnimal);
  const [newSideEffect, setNewSideEffect] = useState<VaccineSideEffectRecord>({
    description: '',
    date: '',
    mediaName: '',
    mediaUrl: '',
    mediaType: '',
  });
  const [message, setMessage] = useState('');
  const vaccineIndexNumber = Number(vaccineIndex);
  const vaccine = animal?.vaccineHistory?.[vaccineIndexNumber];

  if (!animal || !vaccine) {
    return (
      <MobileShell>
        <MobileStatusBar />
        <div className="px-6 pt-2">
          <button
            onClick={() => navigate(`/farm-management/${encodeURIComponent(decodedAnimalId)}`)}
            className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
          >
            Back
          </button>
          <div className="mt-8 rounded-[24px] border border-[#DCE7DF] bg-white p-6 text-center">
            <p className="text-lg font-extrabold text-[#17212B]">Vaccine details not found</p>
            <p className="mt-2 text-sm font-semibold text-[#6B7785]">
              Return to animal details and choose another vaccine entry.
            </p>
          </div>
        </div>
        <MobileBottomNav active="animals" />
      </MobileShell>
    );
  }

  const addSideEffect = async () => {
    const description = newSideEffect.description.trim();
    const date = (newSideEffect.date ?? '').trim();
    if (!description || !date) {
      setMessage('Side effect description and date are required.');
      return;
    }

    const currentHistory = animal.vaccineHistory ?? [];
    const updatedAnimal: AnimalRecord = {
      ...animal,
      vaccineHistory: currentHistory.map((item, index) =>
        index === vaccineIndexNumber
          ? {
              ...item,
              sideEffects: [...getVaccineSideEffects(item), { ...newSideEffect, description }],
            }
          : item,
      ),
    };

    saveAnimalRecord(updatedAnimal);
    setAnimal(updatedAnimal);
    setNewSideEffect({ description: '', date: '', mediaName: '', mediaUrl: '', mediaType: '' });
    setMessage('Side effect added to vaccine history.');
  };

  const handleSideEffectMedia = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      setNewSideEffect((current) => ({ ...current, mediaName: '', mediaUrl: '', mediaType: '' }));
      return;
    }

    setNewSideEffect((current) => ({
      ...current,
      mediaName: file.name,
      mediaType: file.type,
    }));

    const mediaUrl = await readFileAsDataUrl(file);
    setNewSideEffect((current) => ({
      ...current,
      mediaUrl,
    }));
  };

  return (
    <MobileShell>
      <MobileStatusBar />

      <div className="px-6 pt-2">
        <button
          onClick={() => navigate(`/farm-management/${encodeURIComponent(decodedAnimalId)}`)}
          className="rounded-full border border-[#DCE7DF] bg-white px-4 py-2 text-sm font-bold text-[#17212B]"
        >
          Back
        </button>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5 shadow-[0_16px_40px_rgba(23,33,43,0.08)]">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Vaccine Detail</p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#17212B]">{valueOrDash(vaccine.vaccineName)}</h1>
          <p className="mt-1 text-sm font-semibold text-[#6B7785]">{animal.name}</p>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Taken Information</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-[18px] bg-[#F8FCFA] px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Taken On</p>
              <p className="mt-1 text-sm font-semibold text-[#17212B]">{valueOrDash(vaccine.date)}</p>
            </div>
            <div className="rounded-[18px] bg-[#F8FCFA] px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Centre</p>
              <p className="mt-1 text-sm font-semibold text-[#17212B]">{valueOrDash(vaccine.centre)}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Side Effects</h2>
          {message ? (
            <div className="mt-4 rounded-[18px] bg-[#E6F7EF] px-4 py-3 text-sm font-bold text-[#1E9E6F]">
              {message}
            </div>
          ) : null}
          <div className="mt-4 space-y-3">
            {getVaccineSideEffects(vaccine).length ? (
              getVaccineSideEffects(vaccine).map((sideEffect, index) => (
                <div key={`${sideEffect.description}-${index}`} className="rounded-[18px] bg-[#F8FCFA] p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Side Effect #{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-[#6B7785]">Date: {valueOrDash(sideEffect.date)}</p>
                  <p className="mt-2 text-sm font-semibold text-[#17212B]">{valueOrDash(sideEffect.description)}</p>
                  {sideEffect.mediaUrl ? (
                    sideEffect.mediaType?.startsWith('video/') ? (
                      <video src={sideEffect.mediaUrl} className="mt-4 h-56 w-full rounded-[20px] object-cover" controls />
                    ) : (
                      <img
                        src={sideEffect.mediaUrl}
                        alt={sideEffect.mediaName}
                        className="mt-4 h-56 w-full rounded-[20px] object-cover"
                      />
                    )
                  ) : sideEffect.mediaName ? (
                    <p className="mt-3 text-sm font-semibold text-[#17212B]">{valueOrDash(sideEffect.mediaName)}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-[18px] bg-[#F8FCFA] px-4 py-3">
                <p className="text-sm font-semibold text-[#17212B]">No side effect details added.</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-[18px] border border-[#DCE7DF] bg-[#F8FCFA] p-4">
            <p className="text-sm font-extrabold text-[#17212B]">Add Side Effect</p>
            <textarea
              value={newSideEffect.description}
              onChange={(event) =>
                setNewSideEffect((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Side effect description"
              rows={4}
              className="mt-3 w-full resize-none rounded-xl border border-[#DCE7DF] bg-white px-3 py-3 text-sm font-semibold text-[#17212B] outline-none"
            />
            <input
              type="date"
              value={newSideEffect.date ?? ''}
              onChange={(event) =>
                setNewSideEffect((current) => ({ ...current, date: event.target.value }))
              }
              className="mt-3 w-full rounded-xl border border-[#DCE7DF] bg-white px-3 py-3 text-sm font-semibold text-[#17212B] outline-none"
            />
            <label className="mt-3 flex h-11 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7DF] bg-white text-sm font-bold text-[#1E9E6F]">
              {newSideEffect.mediaName || 'Upload image or video (optional)'}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  void handleSideEffectMedia(event.target.files);
                }}
                className="sr-only"
              />
            </label>
            {newSideEffect.mediaUrl ? (
              newSideEffect.mediaType?.startsWith('video/') ? (
                <video src={newSideEffect.mediaUrl} className="mt-3 h-56 w-full rounded-[20px] object-cover" controls />
              ) : (
                <img
                  src={newSideEffect.mediaUrl}
                  alt={newSideEffect.mediaName}
                  className="mt-3 h-56 w-full rounded-[20px] object-cover"
                />
              )
            ) : null}
            <button
              type="button"
              onClick={() => {
                void addSideEffect();
              }}
              className="mt-4 w-full rounded-2xl bg-[#1E9E6F] px-4 py-3 text-sm font-bold text-white"
            >
              Save side effect
            </button>
          </div>
        </section>
      </div>

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
