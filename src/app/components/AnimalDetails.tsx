import { useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAllAnimals,
  saveAnimalRecord,
  type AnimalMediaFile,
  type AnimalRecord,
  type VaccineSideEffectRecord,
} from '../data/animals';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

function getAnimalInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EEF3F2] py-3 last:border-b-0">
      <span className="text-sm font-extrabold text-[#17212B]">{label}</span>
      <span className="max-w-[190px] text-right text-sm font-semibold text-[#6B7785]">{value}</span>
    </div>
  );
}

function EditableInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-[#DCE7DF] bg-white px-3 py-2 text-sm font-semibold text-[#17212B] outline-none"
    />
  );
}

function EditableTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-xl border border-[#DCE7DF] bg-white px-3 py-3 text-sm font-semibold text-[#17212B] outline-none"
    />
  );
}

function EditableRow({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="border-b border-[#EEF3F2] py-3 last:border-b-0">
      <p className="text-sm font-extrabold text-[#17212B]">{label}</p>
      <div className="mt-2">
        <EditableInput value={value} onChange={onChange} type={type} />
      </div>
    </div>
  );
}

function valueOrDash(value: string | undefined) {
  return value && value.trim() ? value : '-';
}

function isMediaFile(file: string | AnimalMediaFile): file is AnimalMediaFile {
  return typeof file !== 'string';
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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

export function AnimalDetails() {
  const navigate = useNavigate();
  const { animalId } = useParams();
  const decodedAnimalId = animalId ? decodeURIComponent(animalId) : '';
  const initialAnimal = getAllAnimals().find((item) => item.id === decodedAnimalId) ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [draftAnimal, setDraftAnimal] = useState<AnimalRecord | null>(initialAnimal);

  if (!draftAnimal) {
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
          <div className="mt-8 rounded-[24px] border border-[#DCE7DF] bg-white p-6 text-center">
            <p className="text-lg font-extrabold text-[#17212B]">Animal not found</p>
            <p className="mt-2 text-sm font-semibold text-[#6B7785]">
              Return to farm management and choose another animal.
            </p>
          </div>
        </div>
        <MobileBottomNav active="animals" />
      </MobileShell>
    );
  }

  const updateAnimalField = <Field extends keyof AnimalRecord>(field: Field, value: AnimalRecord[Field]) => {
    setDraftAnimal((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateMediaFiles = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setDraftAnimal((current) =>
      current ? { ...current, mediaFiles: [...(current.mediaFiles ?? []), ...selected] } : current,
    );
  };

  const removeMediaFile = (index: number) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            mediaFiles: (current.mediaFiles ?? []).filter((_, itemIndex) => itemIndex !== index),
          }
        : current,
    );
  };

  const addDiseaseHistory = () => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            diseaseHistory: [...(current.diseaseHistory ?? []), { diseaseName: '', startDate: '', endDate: '' }],
          }
        : current,
    );
  };

  const updateDiseaseHistory = (index: number, field: 'diseaseName' | 'startDate' | 'endDate', value: string) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            diseaseHistory: (current.diseaseHistory ?? []).map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item,
            ),
          }
        : current,
    );
  };

  const removeDiseaseHistory = (index: number) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            diseaseHistory: (current.diseaseHistory ?? []).filter((_, itemIndex) => itemIndex !== index),
          }
        : current,
    );
  };

  const addVaccineHistory = () => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: [
              ...(current.vaccineHistory ?? []),
              { vaccineName: '', date: '', centre: '', sideEffects: [{ description: '', date: '', mediaName: '', mediaUrl: '', mediaType: '' }], sideEffect: '', sideEffectImageName: '', sideEffectImageUrl: '' },
            ],
          }
        : current,
    );
  };

  const updateVaccineHistory = (
    index: number,
    field: 'vaccineName' | 'date' | 'centre' | 'sideEffects' | 'sideEffect' | 'sideEffectImageName' | 'sideEffectImageUrl' | 'sideEffectImageType',
    value: string,
  ) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: (current.vaccineHistory ?? []).map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item,
            ),
          }
        : current,
    );
  };

  const addVaccineSideEffect = (vaccineIndex: number) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: (current.vaccineHistory ?? []).map((item, itemIndex) =>
              itemIndex === vaccineIndex
                ? {
                    ...item,
                    sideEffects: [...getVaccineSideEffects(item), { description: '', date: '', mediaName: '', mediaUrl: '', mediaType: '' }],
                  }
                : item,
            ),
          }
        : current,
    );
  };

  const updateVaccineSideEffect = (
    vaccineIndex: number,
    sideEffectIndex: number,
    field: keyof VaccineSideEffectRecord,
    value: string,
  ) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: (current.vaccineHistory ?? []).map((item, itemIndex) =>
              itemIndex === vaccineIndex
                ? {
                    ...item,
                    sideEffects: getVaccineSideEffects(item).map((sideEffect, currentIndex) =>
                      currentIndex === sideEffectIndex ? { ...sideEffect, [field]: value } : sideEffect,
                    ),
                  }
                : item,
            ),
          }
        : current,
    );
  };

  const updateVaccineSideEffectMedia = async (vaccineIndex: number, sideEffectIndex: number, files: FileList | null) => {
    const file = files?.[0];
    if (!file) {
      updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaName', '');
      updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaUrl', '');
      updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaType', '');
      return;
    }

    updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaName', file.name);
    updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaType', file.type);
    updateVaccineSideEffect(vaccineIndex, sideEffectIndex, 'mediaUrl', await readFileAsDataUrl(file));
  };

  const removeVaccineSideEffect = (vaccineIndex: number, sideEffectIndex: number) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: (current.vaccineHistory ?? []).map((item, itemIndex) =>
              itemIndex === vaccineIndex
                ? {
                    ...item,
                    sideEffects:
                      getVaccineSideEffects(item).length > 1
                        ? getVaccineSideEffects(item).filter((_, currentIndex) => currentIndex !== sideEffectIndex)
                        : getVaccineSideEffects(item),
                  }
                : item,
            ),
          }
        : current,
    );
  };

  const removeVaccineHistory = (index: number) => {
    setDraftAnimal((current) =>
      current
        ? {
            ...current,
            vaccineHistory: (current.vaccineHistory ?? []).filter((_, itemIndex) => itemIndex !== index),
          }
        : current,
    );
  };

  const cancelEditing = () => {
    const freshAnimal = getAllAnimals().find((item) => item.id === decodedAnimalId) ?? initialAnimal;
    setDraftAnimal(freshAnimal);
    setIsEditing(false);
  };

  const saveChanges = () => {
    saveAnimalRecord(draftAnimal);
    setIsEditing(false);
  };

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

        <section className="mt-5 rounded-[26px] border border-[#DCE7DF] bg-white p-5 shadow-[0_16px_40px_rgba(23,33,43,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-[#DCE7DF] bg-[#E6F7EF]">
                <AvatarFallback className="bg-[#E6F7EF] text-lg font-extrabold text-[#1E9E6F]">
                  {getAnimalInitials(draftAnimal.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-extrabold text-[#17212B]">{draftAnimal.name}</h1>
                <p className="mt-1 text-sm font-bold text-[#6B7785]">{draftAnimal.id}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl border border-[#DCE7DF] bg-white px-3 py-2 text-xs font-bold text-[#17212B]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveChanges}
                  className="rounded-xl bg-[#1E9E6F] px-3 py-2 text-xs font-bold text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-[#E6F7EF] px-3 py-2 text-xs font-bold text-[#1E9E6F]"
              >
                Edit
              </button>
            )}
          </div>

          <div className="mt-5 rounded-[20px] bg-[#F8FCFA] p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Current Status</p>
            <p className="mt-2 text-xl font-extrabold text-[#17212B]">{draftAnimal.status}</p>
            <p className="mt-1 text-sm font-semibold text-[#1E9E6F]">{draftAnimal.note}</p>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Animal Details</h2>
          <div className="mt-3">
            <DetailRow label="Animal Type" value={valueOrDash(draftAnimal.animalType)} />
            <DetailRow label="Subtype / Breed" value={valueOrDash(draftAnimal.subtype || draftAnimal.breed)} />
            {isEditing ? (
              <>
                <EditableRow label="Age" value={draftAnimal.age} onChange={(value) => updateAnimalField('age', value)} />
                <EditableRow label="Age Minimum" value={draftAnimal.ageMin} onChange={(value) => updateAnimalField('ageMin', value)} />
                <EditableRow label="Age Maximum" value={draftAnimal.ageMax} onChange={(value) => updateAnimalField('ageMax', value)} />
                <EditableRow label="Weight" value={draftAnimal.weight} onChange={(value) => updateAnimalField('weight', value)} />
                <EditableRow label="Weight Minimum" value={draftAnimal.weightMin} onChange={(value) => updateAnimalField('weightMin', value)} />
                <EditableRow label="Weight Maximum" value={draftAnimal.weightMax} onChange={(value) => updateAnimalField('weightMax', value)} />
                <EditableRow label="Color" value={draftAnimal.color} onChange={(value) => updateAnimalField('color', value)} />
                <EditableRow label="Teeth Count" value={draftAnimal.teethCount} onChange={(value) => updateAnimalField('teethCount', value)} />
                <EditableRow label="Height" value={draftAnimal.height} onChange={(value) => updateAnimalField('height', value)} />
                <EditableRow label="Width" value={draftAnimal.width} onChange={(value) => updateAnimalField('width', value)} />
                <EditableRow label="Length" value={draftAnimal.length} onChange={(value) => updateAnimalField('length', value)} />
                <EditableRow label="Has Calved" value={draftAnimal.hasCalved} onChange={(value) => updateAnimalField('hasCalved', value)} />
                <EditableRow label="Health Status" value={draftAnimal.status} onChange={(value) => updateAnimalField('status', value)} />
                <EditableRow label="Note" value={draftAnimal.note} onChange={(value) => updateAnimalField('note', value)} />
              </>
            ) : (
              <>
                <DetailRow label="Age" value={valueOrDash(draftAnimal.age)} />
                <DetailRow label="Age Minimum" value={valueOrDash(draftAnimal.ageMin)} />
                <DetailRow label="Age Maximum" value={valueOrDash(draftAnimal.ageMax)} />
                <DetailRow label="Weight" value={valueOrDash(draftAnimal.weight)} />
                <DetailRow label="Weight Minimum" value={valueOrDash(draftAnimal.weightMin)} />
                <DetailRow label="Weight Maximum" value={valueOrDash(draftAnimal.weightMax)} />
                <DetailRow label="Color" value={valueOrDash(draftAnimal.color)} />
                <DetailRow label="Teeth Count" value={valueOrDash(draftAnimal.teethCount)} />
                <DetailRow label="Height" value={valueOrDash(draftAnimal.height)} />
                <DetailRow label="Width" value={valueOrDash(draftAnimal.width)} />
                <DetailRow label="Length" value={valueOrDash(draftAnimal.length)} />
                <DetailRow label="Has Calved" value={valueOrDash(draftAnimal.hasCalved)} />
                <DetailRow label="Health Status" value={draftAnimal.status} />
                <DetailRow label="Note" value={draftAnimal.note} />
              </>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Media</h2>
          <div className="mt-3 space-y-2">
            {draftAnimal.mediaFiles?.length ? (
              draftAnimal.mediaFiles.map((file, index) =>
                isMediaFile(file) ? (
                  <div key={file.url} className="overflow-hidden rounded-2xl bg-[#F8FCFA]">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="h-44 w-full object-cover" />
                    ) : (
                      <video src={file.url} className="h-44 w-full object-cover" controls />
                    )}
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[#6B7785]">{file.name}</p>
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => removeMediaFile(index)}
                          className="text-xs font-bold text-[#D96758]"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p key={file} className="truncate rounded-2xl bg-[#F8FCFA] px-4 py-3 text-sm font-semibold text-[#6B7785]">
                    {file}
                  </p>
                ),
              )
            ) : (
              <p className="text-sm font-semibold text-[#6B7785]">No media added.</p>
            )}
            {isEditing ? (
              <label className="flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-[#DCE7DF] bg-[#F8FCFA] text-sm font-bold text-[#1E9E6F]">
                Add media
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateMediaFiles(event.target.files)}
                  className="sr-only"
                />
              </label>
            ) : null}
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Description</h2>
          {isEditing ? (
            <div className="mt-3">
              <EditableTextarea
                value={draftAnimal.description}
                onChange={(value) => updateAnimalField('description', value)}
                placeholder="Write animal description"
              />
            </div>
          ) : (
            <p className="mt-3 text-sm font-semibold leading-6 text-[#6B7785]">{draftAnimal.description}</p>
          )}
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Disease History</h2>
          <div className="mt-3 space-y-3">
            {draftAnimal.diseaseHistory?.length ? (
              draftAnimal.diseaseHistory.map((disease, index) => (
                <div key={`${disease.diseaseName}-${index}`} className="rounded-2xl bg-[#F8FCFA] p-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <EditableInput
                        value={disease.diseaseName}
                        onChange={(value) => updateDiseaseHistory(index, 'diseaseName', value)}
                        placeholder="Disease name"
                      />
                      <EditableInput
                        value={disease.startDate}
                        onChange={(value) => updateDiseaseHistory(index, 'startDate', value)}
                        type="date"
                      />
                      <EditableInput
                        value={disease.endDate}
                        onChange={(value) => updateDiseaseHistory(index, 'endDate', value)}
                        type="date"
                      />
                      <button
                        type="button"
                        onClick={() => removeDiseaseHistory(index)}
                        className="text-xs font-bold text-[#D96758]"
                      >
                        Remove disease
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-extrabold text-[#17212B]">{valueOrDash(disease.diseaseName)}</p>
                      <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                        Starting date: {valueOrDash(disease.startDate)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                        Ending date: {valueOrDash(disease.endDate)}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#6B7785]">No disease history added.</p>
            )}
            {isEditing ? (
              <button
                type="button"
                onClick={addDiseaseHistory}
                className="w-full rounded-2xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#1E9E6F]"
              >
                Add disease history
              </button>
            ) : null}
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Vaccine History Taken</h2>
          <div className="mt-3 space-y-3">
            {draftAnimal.vaccineHistory?.length ? (
              draftAnimal.vaccineHistory.map((vaccine, index) => (
                <div key={`${vaccine.vaccineName}-${index}`} className="rounded-2xl bg-[#F8FCFA] p-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <EditableInput
                        value={vaccine.vaccineName}
                        onChange={(value) => updateVaccineHistory(index, 'vaccineName', value)}
                        placeholder="Vaccine name"
                      />
                      <EditableInput
                        value={vaccine.date}
                        onChange={(value) => updateVaccineHistory(index, 'date', value)}
                        type="date"
                      />
                      <EditableInput
                        value={vaccine.centre}
                        onChange={(value) => updateVaccineHistory(index, 'centre', value)}
                        placeholder="Centre"
                      />
                      <div className="space-y-3 rounded-xl border border-[#DCE7DF] bg-white p-3">
                        {getVaccineSideEffects(vaccine).map((sideEffect, sideEffectIndex) => (
                          <div key={`${index}-${sideEffectIndex}`} className="rounded-xl bg-[#F8FCFA] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-extrabold text-[#17212B]">Side Effect #{sideEffectIndex + 1}</p>
                              {getVaccineSideEffects(vaccine).length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => removeVaccineSideEffect(index, sideEffectIndex)}
                                  className="text-xs font-bold text-[#D96758]"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            <div className="mt-2">
                              <EditableTextarea
                                value={sideEffect.description}
                                onChange={(value) => updateVaccineSideEffect(index, sideEffectIndex, 'description', value)}
                                placeholder="Side effect description"
                                rows={3}
                              />
                            </div>
                            <div className="mt-2">
                              <EditableInput
                                value={sideEffect.date}
                                onChange={(value) => updateVaccineSideEffect(index, sideEffectIndex, 'date', value)}
                                type="date"
                              />
                            </div>
                            <label className="mt-2 flex h-11 cursor-pointer items-center justify-center rounded-xl border border-[#DCE7DF] bg-white text-sm font-bold text-[#1E9E6F]">
                              {sideEffect.mediaName || 'Upload side effect image or video'}
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                  updateVaccineSideEffectMedia(index, sideEffectIndex, event.target.files)
                                }
                                className="sr-only"
                              />
                            </label>
                            {sideEffect.mediaUrl ? (
                              sideEffect.mediaType?.startsWith('video/') ? (
                                <video src={sideEffect.mediaUrl} className="mt-3 h-40 w-full rounded-2xl object-cover" controls />
                              ) : (
                                <img src={sideEffect.mediaUrl} alt={sideEffect.mediaName} className="mt-3 h-40 w-full rounded-2xl object-cover" />
                              )
                            ) : null}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVaccineSideEffect(index)}
                          className="w-full rounded-xl border border-[#DCE7DF] bg-[#F8FCFA] px-4 py-3 text-sm font-bold text-[#1E9E6F]"
                        >
                          Add another side effect
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVaccineHistory(index)}
                        className="text-xs font-bold text-[#D96758]"
                      >
                        Remove vaccine history
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/farm-management/${encodeURIComponent(decodedAnimalId)}/vaccine-history/${index}`,
                          )
                        }
                        className="text-left text-sm font-extrabold text-[#17212B] underline decoration-[#C9D6E0] underline-offset-4"
                      >
                        {valueOrDash(vaccine.vaccineName)}
                      </button>
                      <p className="mt-1 text-sm font-semibold text-[#6B7785]">Taken on: {valueOrDash(vaccine.date)}</p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#6B7785]">No vaccine history added.</p>
            )}
            {isEditing ? (
              <button
                type="button"
                onClick={addVaccineHistory}
                className="w-full rounded-2xl border border-[#DCE7DF] bg-white px-4 py-3 text-sm font-bold text-[#1E9E6F]"
              >
                Add vaccine history
              </button>
            ) : null}
          </div>
        </section>
      </div>

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
