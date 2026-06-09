import { useNavigate, useParams } from 'react-router-dom';
import { getAllAnimals, type AnimalMediaFile } from '../data/animals';
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

function valueOrDash(value: string | undefined) {
  return value && value.trim() ? value : '-';
}

function isMediaFile(file: string | AnimalMediaFile): file is AnimalMediaFile {
  return typeof file !== 'string';
}

export function AnimalDetails() {
  const navigate = useNavigate();
  const { animalId } = useParams();
  const decodedAnimalId = animalId ? decodeURIComponent(animalId) : '';
  const animal = getAllAnimals().find((item) => item.id === decodedAnimalId);

  if (!animal) {
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
            <p className="mt-2 text-sm font-semibold text-[#6B7785]">Return to farm management and choose another animal.</p>
          </div>
        </div>
        <MobileBottomNav active="animals" />
      </MobileShell>
    );
  }

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
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-[#DCE7DF] bg-[#E6F7EF]">
              <AvatarFallback className="bg-[#E6F7EF] text-lg font-extrabold text-[#1E9E6F]">
                {getAnimalInitials(animal.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-extrabold text-[#17212B]">{animal.name}</h1>
              <p className="mt-1 text-sm font-bold text-[#6B7785]">{animal.id}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[20px] bg-[#F8FCFA] p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#6B7785]">Current Status</p>
            <p className="mt-2 text-xl font-extrabold text-[#17212B]">{animal.status}</p>
            <p className="mt-1 text-sm font-semibold text-[#1E9E6F]">{animal.note}</p>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Animal Details</h2>
          <div className="mt-3">
            <DetailRow label="Animal Type" value={valueOrDash(animal.animalType)} />
            <DetailRow label="Subtype / Breed" value={valueOrDash(animal.subtype || animal.breed)} />
            <DetailRow label="Age" value={valueOrDash(animal.age)} />
            <DetailRow label="Age Minimum" value={valueOrDash(animal.ageMin)} />
            <DetailRow label="Age Maximum" value={valueOrDash(animal.ageMax)} />
            <DetailRow label="Weight" value={valueOrDash(animal.weight)} />
            <DetailRow label="Weight Minimum" value={valueOrDash(animal.weightMin)} />
            <DetailRow label="Weight Maximum" value={valueOrDash(animal.weightMax)} />
            <DetailRow label="Color" value={valueOrDash(animal.color)} />
            <DetailRow label="Teeth Count" value={valueOrDash(animal.teethCount)} />
            <DetailRow label="Height" value={valueOrDash(animal.height)} />
            <DetailRow label="Width" value={valueOrDash(animal.width)} />
            <DetailRow label="Length" value={valueOrDash(animal.length)} />
            <DetailRow label="Has Calved" value={valueOrDash(animal.hasCalved)} />
            <DetailRow label="Health Status" value={animal.status} />
            <DetailRow label="Note" value={animal.note} />
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Media</h2>
          <div className="mt-3 space-y-2">
            {animal.mediaFiles?.length ? (
              animal.mediaFiles.map((file) =>
                isMediaFile(file) ? (
                  <div key={file.url} className="overflow-hidden rounded-2xl bg-[#F8FCFA]">
                    {file.type.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="h-44 w-full object-cover" />
                    ) : (
                      <video src={file.url} className="h-44 w-full object-cover" controls />
                    )}
                    <p className="truncate px-4 py-3 text-sm font-semibold text-[#6B7785]">{file.name}</p>
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
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Description</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#6B7785]">{animal.description}</p>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Disease History</h2>
          <div className="mt-3 space-y-3">
            {animal.diseaseHistory?.length ? (
              animal.diseaseHistory.map((disease, index) => (
                <div key={`${disease.diseaseName}-${index}`} className="rounded-2xl bg-[#F8FCFA] p-4">
                  <p className="text-sm font-extrabold text-[#17212B]">{valueOrDash(disease.diseaseName)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                    Starting date: {valueOrDash(disease.startDate)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                    Ending date: {valueOrDash(disease.endDate)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#6B7785]">No disease history added.</p>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DCE7DF] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#17212B]">Vaccine History Taken</h2>
          <div className="mt-3 space-y-3">
            {animal.vaccineHistory?.length ? (
              animal.vaccineHistory.map((vaccine, index) => (
                <div key={`${vaccine.vaccineName}-${index}`} className="rounded-2xl bg-[#F8FCFA] p-4">
                  <p className="text-sm font-extrabold text-[#17212B]">{valueOrDash(vaccine.vaccineName)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">Date: {valueOrDash(vaccine.date)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">Centre: {valueOrDash(vaccine.centre)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6B7785]">Side effect: {valueOrDash(vaccine.sideEffect)}</p>
                  {vaccine.sideEffectImageUrl ? (
                    <img
                      src={vaccine.sideEffectImageUrl}
                      alt={vaccine.sideEffectImageName}
                      className="mt-3 h-40 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-[#6B7785]">
                      Side effect image: {valueOrDash(vaccine.sideEffectImageName)}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-[#6B7785]">No vaccine history added.</p>
            )}
          </div>
        </section>
      </div>

      <MobileBottomNav active="animals" />
    </MobileShell>
  );
}
