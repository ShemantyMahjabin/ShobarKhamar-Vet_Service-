import { useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, ChevronLeft, ClipboardCheck, ImagePlus, Plus, Trash2, Video } from 'lucide-react';
import { saveAnimalRecord, type AnimalMediaFile } from '../data/animals';
import { getAllVaccines } from '../data/vaccines';
import { MobileShell } from './layout/MobileShell';
import { MobileStatusBar } from './layout/MobileStatusBar';

const animalTypes = ['Cow', 'Goat', 'Buffalo', 'Sheep', 'Camel', 'Others'];

const animalSubtypes: Record<string, string[]> = {
  Cow: ['Cow calf', 'Heifer calf', 'Milk cow', 'Bull cow', 'Castrated cow', 'Sahiwal', 'Holstein Friesian'],
  Goat: ['Buck kid', 'Doe kid', 'Black Bengal', 'Jamunapari', 'Boer', 'Local goat'],
  Buffalo: ['Bull calf', 'Heifer calf', 'Female buffalo', 'Bull buffalo', 'Castrated buffalo'],
  Sheep: ['Ram lamb', 'Ewe lamb', 'Adult ewe', 'Adult ram', 'Local sheep'],
  Camel: ['Camel calf', 'Female camel', 'Male camel', 'Working camel'],
  Others: ['Young animal', 'Adult animal', 'Breeding animal', 'Working animal'],
};

const ageRanges = ['22-28 months', '28-34 months', '34-40 months', '40-46 months'];
const weightRanges = ['130-170 kg', '170-210 kg', '210-250 kg', '290-330 kg'];
const colors = ['Black', 'White', 'Brown', 'Mixed', 'Grey', 'Red'];
const teethCounts = ['0', '2', '4', '6', '8'];

type DiseaseHistory = {
  diseaseName: string;
  startDate: string;
  endDate: string;
};

type VaccineHistory = {
  vaccineName: string;
  date: string;
  centre: string;
  sideEffect: string;
  sideEffectImageName: string;
  sideEffectImageUrl: string;
};

type FormState = {
  name: string;
  animalType: string;
  subtype: string;
  ageMin: string;
  ageMax: string;
  ageRange: string;
  weightMin: string;
  weightMax: string;
  weightRange: string;
  color: string;
  teethCount: string;
  height: string;
  width: string;
  length: string;
  hasCalved: string;
  description: string;
  mediaFiles: AnimalMediaFile[];
};

const emptyDisease: DiseaseHistory = {
  diseaseName: '',
  startDate: '',
  endDate: '',
};

const emptyVaccine: VaccineHistory = {
  vaccineName: '',
  date: '',
  centre: '',
  sideEffect: '',
  sideEffectImageName: '',
  sideEffectImageUrl: '',
};

const initialForm: FormState = {
  name: '',
  animalType: '',
  subtype: '',
  ageMin: '',
  ageMax: '',
  ageRange: '',
  weightMin: '',
  weightMax: '',
  weightRange: '',
  color: '',
  teethCount: '',
  height: '',
  width: '',
  length: '',
  hasCalved: 'No',
  description: '',
  mediaFiles: [],
};

const steps = ['Info', 'Media', 'History', 'Verify'];

function RequiredMark() {
  return <span className="text-[#D96758]">*</span>;
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="text-base font-extrabold leading-tight text-[#161A1D]">
      {children}
      {required ? <RequiredMark /> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      className="mt-3 h-14 w-full rounded-[18px] border border-[#E7ECEA] bg-white px-5 text-base font-semibold text-[#161A1D] shadow-[0_8px_22px_rgba(23,33,43,0.04)] outline-none placeholder:text-[#C8CCCF] focus:border-[#429EAE]"
    />
  );
}

function SelectInput({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`mt-3 h-14 w-full rounded-[18px] border border-[#E7ECEA] bg-white px-5 text-base font-extrabold shadow-[0_8px_22px_rgba(23,33,43,0.04)] outline-none focus:border-[#429EAE] ${
        value ? 'text-[#161A1D]' : 'text-[#C8CCCF]'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function StepHeader({
  currentStep,
  title,
  onBack,
}: {
  currentStep: number;
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-[#EEF3F2] bg-[#F3FBFC]/95 pb-3 backdrop-blur">
      <MobileStatusBar />
      <div className="relative flex items-center justify-center px-5">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 flex h-9 w-9 items-center justify-center rounded-full text-[#161A1D]"
          aria-label="Go back"
        >
          <ChevronLeft size={28} strokeWidth={2.6} />
        </button>
        <h1 className="text-[24px] font-extrabold leading-none text-[#161A1D]">{title}</h1>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 px-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-1.5 rounded-full ${index <= currentStep ? 'bg-[#429EAE]' : 'bg-[#DADDDD]'}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-full border px-3 py-2 text-xs font-extrabold ${
            selected === option
              ? 'border-[#429EAE] bg-[#E5F5F7] text-[#2E8794]'
              : 'border-[#A6CDD4] bg-white text-[#429EAE]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function UploadButton({
  label,
  accept,
  multiple = false,
  onChange,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[16px] border border-[#429EAE] bg-white px-4 text-sm font-extrabold text-[#2E8794]">
      <ImagePlus size={18} />
      {label}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)}
        className="sr-only"
      />
    </label>
  );
}

function HistoryCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-[#E2E9E6] bg-white p-4 shadow-[0_10px_28px_rgba(23,33,43,0.06)]">
      <h3 className="text-lg font-extrabold text-[#161A1D]">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function AddAnimal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [diseases, setDiseases] = useState<DiseaseHistory[]>([{ ...emptyDisease }]);
  const [vaccines, setVaccines] = useState<VaccineHistory[]>([{ ...emptyVaccine }]);
  const [isComplete, setIsComplete] = useState(false);
  const [vaccinationCenters] = useState(() =>
    Array.from(
      new Set(
        getAllVaccines()
          .map((vaccine) => vaccine.centerName)
          .filter((centerName): centerName is string => Boolean(centerName)),
      ),
    ),
  );

  const subtypeOptions = useMemo(() => animalSubtypes[form.animalType] ?? [], [form.animalType]);
  const displayAge = form.ageRange || [form.ageMin, form.ageMax].filter(Boolean).join(' - ');
  const displayWeight = form.weightRange || [form.weightMin, form.weightMax].filter(Boolean).join(' - ');
  const imageCount = form.mediaFiles.filter((file) => file.type.startsWith('image/')).length;
  const videoCount = form.mediaFiles.length - imageCount;

  const updateForm = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'animalType') {
        next.subtype = '';
      }
      return next;
    });
  };

  const goBack = () => {
    if (isComplete) {
      setIsComplete(false);
      setStep(3);
      return;
    }

    if (step === 0) {
      navigate('/farm-management');
      return;
    }

    setStep((current) => current - 1);
  };

  const goNext = () => {
    if (step === steps.length - 1) {
      submitAnimal();
      setIsComplete(true);
      return;
    }

    setStep((current) => current + 1);
  };

  const submitAnimal = () => {
    const displayName = form.name.trim() || `${form.animalType || 'Animal'} ${Date.now().toString().slice(-4)}`;
    const animalType = form.animalType || 'Animal';
    const subtype = form.subtype || 'Not specified';
    const animalId = `${animalType} ${displayName}`;

    saveAnimalRecord({
      id: animalId,
      name: displayName,
      breed: subtype,
      age: displayAge || 'Not specified',
      ageMin: form.ageMin,
      ageMax: form.ageMax,
      weight: displayWeight || 'Not specified',
      weightMin: form.weightMin,
      weightMax: form.weightMax,
      animalType,
      subtype,
      color: form.color,
      teethCount: form.teethCount,
      height: form.height,
      width: form.width,
      length: form.length,
      hasCalved: form.hasCalved,
      mediaFiles: form.mediaFiles,
      diseaseHistory: diseases.filter((disease) => disease.diseaseName || disease.startDate || disease.endDate),
      vaccineHistory: vaccines.filter((vaccine) => vaccine.vaccineName || vaccine.date || vaccine.centre || vaccine.sideEffect || vaccine.sideEffectImageName),
      status: 'Registered',
      note: form.hasCalved === 'Yes' ? 'Has calved' : 'New animal profile',
      description: form.description || 'No additional information added.',
    });
  };

  const updateDisease = (index: number, field: keyof DiseaseHistory, value: string) => {
    setDiseases((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const updateVaccine = (index: number, field: keyof VaccineHistory, value: string) => {
    setVaccines((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const updateMediaFiles = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const selected = Array.from(files);
    const images = selected.filter((file) => file.type.startsWith('image/')).slice(0, 3);
    const videos = selected.filter((file) => file.type.startsWith('video/')).slice(0, 1);
    const mediaFiles = [...images, ...videos].map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    updateForm('mediaFiles', mediaFiles);
  };

  const updateSideEffectImage = (index: number, files: FileList | null) => {
    const file = files?.[0];
    updateVaccine(index, 'sideEffectImageName', file?.name ?? '');
    updateVaccine(index, 'sideEffectImageUrl', file ? URL.createObjectURL(file) : '');
  };

  const removeDisease = (index: number) => {
    setDiseases((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeVaccine = (index: number) => {
    setVaccines((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  if (isComplete) {
    return (
      <MobileShell className="bg-white">
        <div className="flex min-h-[844px] flex-col justify-center px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F7EA]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#46B653] text-white">
                <Check size={42} strokeWidth={3} />
              </div>
            </div>
            <h1 className="mt-8 text-[28px] font-extrabold text-[#A5A8AA]">Success</h1>
            <p className="mt-5 text-lg font-extrabold text-[#161A1D]">New animal added successfully</p>
          </div>
          <div className="mt-24 space-y-4">
            <button
              type="button"
              onClick={() => navigate('/farm-management')}
              className="h-14 w-full rounded-[20px] bg-[#46B653] text-lg font-extrabold text-white"
            >
              View My Animals
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer-dashboard')}
              className="h-14 w-full rounded-[20px] border border-[#BFC6C2] bg-white text-lg font-extrabold text-[#161A1D]"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell className="bg-[#F7F8FA]">
      <StepHeader currentStep={step} title="Add Cattle" onBack={goBack} />

      <main className="px-6 pb-8 pt-8">
        {step === 0 ? (
          <div className="space-y-8">
            <section>
              <FieldLabel required>Animal Name OR Number</FieldLabel>
              <p className="mt-2 text-sm font-medium text-[#B8BABC]">Write your animal name</p>
              <TextInput
                value={form.name}
                onChange={(value) => updateForm('name', value)}
                placeholder="Write your animal name"
              />
            </section>

            <section>
              <FieldLabel required>Select the type of animal</FieldLabel>
              <SelectInput
                value={form.animalType}
                onChange={(value) => updateForm('animalType', value)}
                placeholder="Select the type of animal"
                options={animalTypes}
              />
            </section>

            <section>
              <FieldLabel required>Select Animal Subtype</FieldLabel>
              <SelectInput
                value={form.subtype}
                onChange={(value) => updateForm('subtype', value)}
                placeholder="Select Animal Subtype"
                options={subtypeOptions}
              />
            </section>

            <section>
              <FieldLabel required>Age</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <TextInput value={form.ageMin} onChange={(value) => updateForm('ageMin', value)} placeholder="Minimum" />
                <TextInput value={form.ageMax} onChange={(value) => updateForm('ageMax', value)} placeholder="Maximum" />
              </div>
              <ChipGroup options={ageRanges} selected={form.ageRange} onSelect={(value) => updateForm('ageRange', value)} />
            </section>

            <section>
              <FieldLabel required>Weight</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  value={form.weightMin}
                  onChange={(value) => updateForm('weightMin', value)}
                  placeholder="Minimum"
                />
                <TextInput
                  value={form.weightMax}
                  onChange={(value) => updateForm('weightMax', value)}
                  placeholder="Maximum"
                />
              </div>
              <ChipGroup
                options={weightRanges}
                selected={form.weightRange}
                onSelect={(value) => updateForm('weightRange', value)}
              />
            </section>

            <section>
              <FieldLabel required>Color</FieldLabel>
              <SelectInput value={form.color} onChange={(value) => updateForm('color', value)} placeholder="Select Color" options={colors} />
            </section>

            <section>
              <FieldLabel required>Teeth Count</FieldLabel>
              <SelectInput
                value={form.teethCount}
                onChange={(value) => updateForm('teethCount', value)}
                placeholder="Select teeth count"
                options={teethCounts}
              />
            </section>

            <section>
              <FieldLabel>Additional Information</FieldLabel>
              <textarea
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                placeholder="Write more details about your animal..."
                rows={5}
                className="mt-3 w-full resize-none rounded-[20px] border border-[#E7ECEA] bg-white px-5 py-4 text-base font-semibold text-[#161A1D] shadow-[0_8px_22px_rgba(23,33,43,0.04)] outline-none placeholder:text-[#C8CCCF] focus:border-[#429EAE]"
              />
            </section>

            <div className="grid grid-cols-3 gap-3">
              <TextInput value={form.height} onChange={(value) => updateForm('height', value)} placeholder="Height" />
              <TextInput value={form.width} onChange={(value) => updateForm('width', value)} placeholder="Width" />
              <TextInput value={form.length} onChange={(value) => updateForm('length', value)} placeholder="Length" />
            </div>

            <section>
              <FieldLabel>Has Calved</FieldLabel>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateForm('hasCalved', option)}
                    className={`h-12 rounded-[18px] border text-sm font-extrabold ${
                      form.hasCalved === option
                        ? 'border-[#429EAE] bg-[#429EAE] text-white'
                        : 'border-[#D9DEDC] bg-white text-[#161A1D]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <label className="flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#B8D8DD] bg-[#E8F7F9] px-5 text-center">
              <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[#429EAE] text-white">
                <Camera size={48} strokeWidth={2.6} />
              </span>
              <span className="mt-7 text-[24px] font-extrabold text-[#161A1D]">Click to add Media</span>
              <span className="mt-4 flex items-center gap-2 text-base font-medium text-[#8D9296]">
                <ImagePlus size={28} /> {imageCount}/3 images
              </span>
              <span className="mt-2 flex items-center gap-2 text-lg font-semibold text-[#8D9296]">
                <Video size={20} /> {videoCount}/1 video
              </span>
              <span className="mt-3 text-base font-extrabold text-[#46B653]">Add images + video (any order)</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(event) => updateMediaFiles(event.target.files)}
                className="sr-only"
              />
            </label>

            <div className="rounded-[18px] bg-white p-4 text-lg font-bold leading-snug text-[#4C5154]">
              <div className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B7074] text-xs text-white">i</span>
                <p>
                  <ImagePlus className="mr-1 inline" size={22} /> Max 3 images +{' '}
                  <Video className="mx-1 inline" size={22} /> 1 video (max 15 seconds). Add in any order.
                </p>
              </div>
            </div>

            {form.mediaFiles.length ? (
              <div className="space-y-2 rounded-[18px] bg-white p-4">
                <p className="text-sm font-extrabold text-[#161A1D]">Selected media</p>
                {form.mediaFiles.map((file) => (
                  <div key={file.url} className="overflow-hidden rounded-2xl bg-[#F8FCFA]">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="h-36 w-full object-cover" />
                    ) : (
                      <video src={file.url} className="h-36 w-full object-cover" controls />
                    )}
                    <p className="truncate px-3 py-2 text-sm font-semibold text-[#757B80]">{file.name}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-[22px] font-extrabold leading-tight text-[#161A1D]">Medical history metadata</h2>
              <p className="mt-2 text-sm font-semibold leading-snug text-[#8D9296]">
                Add previous disease and vaccine records before verifying the animal profile.
              </p>
            </div>

            <HistoryCard title="Disease History">
              {diseases.map((disease, index) => (
                <div key={`disease-${index}`} className="rounded-[18px] bg-[#F7F8FA] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-[#161A1D]">Disease #{index + 1}</p>
                    {diseases.length > 1 ? (
                      <button type="button" onClick={() => removeDisease(index)} className="text-[#D96758]" aria-label="Remove disease">
                        <Trash2 size={18} />
                      </button>
                    ) : null}
                  </div>
                  <TextInput
                    value={disease.diseaseName}
                    onChange={(value) => updateDisease(index, 'diseaseName', value)}
                    placeholder="Disease name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      value={disease.startDate}
                      onChange={(value) => updateDisease(index, 'startDate', value)}
                      placeholder="Starting date"
                      type="date"
                    />
                    <TextInput
                      value={disease.endDate}
                      onChange={(value) => updateDisease(index, 'endDate', value)}
                      placeholder="Ending date"
                      type="date"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDiseases((current) => [...current, { ...emptyDisease }])}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-[#429EAE] bg-[#E8F7F9] text-sm font-extrabold text-[#2E8794]"
              >
                <Plus size={18} /> Add disease record
              </button>
            </HistoryCard>

            <HistoryCard title="Vaccine History Taken">
              {vaccines.map((vaccine, index) => (
                <div key={`vaccine-${index}`} className="rounded-[18px] bg-[#F7F8FA] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-[#161A1D]">Vaccine #{index + 1}</p>
                    {vaccines.length > 1 ? (
                      <button type="button" onClick={() => removeVaccine(index)} className="text-[#D96758]" aria-label="Remove vaccine">
                        <Trash2 size={18} />
                      </button>
                    ) : null}
                  </div>
                  <TextInput
                    value={vaccine.vaccineName}
                    onChange={(value) => updateVaccine(index, 'vaccineName', value)}
                    placeholder="Vaccine name"
                  />
                  <TextInput value={vaccine.date} onChange={(value) => updateVaccine(index, 'date', value)} placeholder="Date" type="date" />
                  <SelectInput
                    value={vaccine.centre}
                    onChange={(value) => updateVaccine(index, 'centre', value)}
                    placeholder="Choose vaccination centre"
                    options={vaccinationCenters}
                  />
                  <textarea
                    value={vaccine.sideEffect}
                    onChange={(event) => updateVaccine(index, 'sideEffect', event.target.value)}
                    placeholder="Side effect description"
                    rows={3}
                    className="mt-3 w-full resize-none rounded-[18px] border border-[#E7ECEA] bg-white px-5 py-4 text-base font-semibold text-[#161A1D] outline-none placeholder:text-[#C8CCCF] focus:border-[#429EAE]"
                  />
                  <UploadButton
                    label={vaccine.sideEffectImageName || 'Upload side effect image'}
                    accept="image/*"
                    onChange={(files) => updateSideEffectImage(index, files)}
                  />
                  {vaccine.sideEffectImageUrl ? (
                    <img
                      src={vaccine.sideEffectImageUrl}
                      alt={vaccine.sideEffectImageName}
                      className="mt-3 h-36 w-full rounded-2xl object-cover"
                    />
                  ) : null}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVaccines((current) => [...current, { ...emptyVaccine }])}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-[#429EAE] bg-[#E8F7F9] text-sm font-extrabold text-[#2E8794]"
              >
                <Plus size={18} /> Add vaccine record
              </button>
            </HistoryCard>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-[24px] font-extrabold leading-tight text-[#161A1D]">Verify Information</h2>
              <p className="mt-3 text-base font-medium leading-snug text-[#989C9F]">
                Check the card below to ensure the information provided is correct.
              </p>
            </div>

            <section className="rounded-[20px] border border-[#E2E9E6] bg-white p-5 shadow-[0_12px_30px_rgba(23,33,43,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[20px] font-extrabold leading-tight text-[#161A1D]">
                  {form.animalType || 'Animal'} &gt; {form.subtype || 'Subtype'}
                </h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F7F9] text-[#429EAE]">
                  <ClipboardCheck size={21} />
                </span>
              </div>
              <div className="mt-5 divide-y divide-[#EEF1F0] border-t border-[#C9D0CE]">
                {[
                  ['Name', form.name || '-'],
                  ['Age', displayAge || '-'],
                  ['Weight', displayWeight || '-'],
                  ['Color', form.color || '-'],
                  ['Teeth', form.teethCount || '-'],
                  ['Height', form.height || '-'],
                  ['Width', form.width || '-'],
                  ['Length', form.length || '-'],
                  ['Has Calved', form.hasCalved],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="font-extrabold text-[#161A1D]">{label}:</span>
                    <span className="text-right font-semibold text-[#757B80]">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-extrabold text-[#161A1D]">Disease History</h3>
              {diseases.map((disease, index) => (
                <div key={`summary-disease-${index}`} className="rounded-[16px] bg-white p-4 text-sm font-semibold text-[#757B80]">
                  <span className="font-extrabold text-[#161A1D]">{disease.diseaseName || `Disease #${index + 1}`}</span>
                  <span>
                    {' '}
                    - {[disease.startDate, disease.endDate].filter(Boolean).join(' to ') || 'Dates not added'}
                  </span>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-extrabold text-[#161A1D]">Vaccine History Taken</h3>
              {vaccines.map((vaccine, index) => (
                <div key={`summary-vaccine-${index}`} className="rounded-[16px] bg-white p-4 text-sm font-semibold text-[#757B80]">
                  <p className="font-extrabold text-[#161A1D]">{vaccine.vaccineName || `Vaccine #${index + 1}`}</p>
                  <p>{[vaccine.date, vaccine.centre].filter(Boolean).join(' - ') || 'Date and centre not added'}</p>
                  <p>{vaccine.sideEffect || 'No side effect description added'}</p>
                  {vaccine.sideEffectImageUrl ? (
                    <img
                      src={vaccine.sideEffectImageUrl}
                      alt={vaccine.sideEffectImageName}
                      className="mt-3 h-32 w-full rounded-2xl object-cover"
                    />
                  ) : vaccine.sideEffectImageName ? (
                    <p>Image: {vaccine.sideEffectImageName}</p>
                  ) : null}
                </div>
              ))}
            </section>
          </div>
        ) : null}

        <button
          type="button"
          onClick={goNext}
          className="mt-8 h-14 w-full rounded-[22px] bg-[#429EAE] text-lg font-extrabold text-white shadow-[0_12px_22px_rgba(66,158,174,0.25)] disabled:bg-[#D7D9DB]"
        >
          {step === steps.length - 1 ? 'Submit' : 'Next Step ->'}
        </button>
      </main>
    </MobileShell>
  );
}
