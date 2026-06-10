import { appendAnimalVaccineHistory, getAllAnimals } from './animals';
import { vaccineCatalog } from './vaccines';

export type VaccinationStatus = 'done' | 'pending';

export type VaccinationAnimalEntry = {
  id: string;
  animalId: string;
  vaccineName: string;
  date: string;
  status: 'added';
};

export type VaccinationRecord = {
  id: number;
  vaccineId: number;
  vaccineName: string;
  animalIds: string[];
  eligibleAnimalIds: string[];
  ineligibleAnimalIds: string[];
  date: string;
  center: string;
  status: VaccinationStatus;
  entries: VaccinationAnimalEntry[];
};

let nextRecordId = 3;

const records: VaccinationRecord[] = [
  {
    id: 1,
    vaccineId: 1,
    vaccineName: 'FMD vaccine',
    animalIds: ['Cow A12', 'Calf C03'],
    eligibleAnimalIds: ['Cow A12'],
    ineligibleAnimalIds: ['Calf C03'],
    date: '2026-06-09',
    center: 'Badda Livestock Vaccine Point',
    status: 'pending',
    entries: [],
  },
  {
    id: 2,
    vaccineId: 5,
    vaccineName: 'PPR vaccine',
    animalIds: ['Goat G08'],
    eligibleAnimalIds: ['Goat G08'],
    ineligibleAnimalIds: [],
    date: '2026-05-12',
    center: 'Keraniganj Goat Care Center',
    status: 'done',
    entries: [
      {
        id: '2-Goat G08',
        animalId: 'Goat G08',
        vaccineName: 'PPR vaccine',
        date: '2026-05-12',
        status: 'added',
      },
    ],
  },
];

function createEntries(record: VaccinationRecord) {
  return record.eligibleAnimalIds.map((animalId) => ({
    id: `${record.id}-${animalId}`,
    animalId,
    vaccineName: record.vaccineName,
    date: record.date,
    status: 'added' as const,
  }));
}

export function getVaccinationRecords() {
  return records.map((record) => ({ ...record, entries: [...record.entries] }));
}

export function addVaccinationRecord(input: {
  vaccineId: number;
  animalIds: string[];
  eligibleAnimalIds: string[];
  ineligibleAnimalIds: string[];
  date: string;
  center: string;
  status: VaccinationStatus;
}) {
  const vaccine = vaccineCatalog.find((item) => item.id === input.vaccineId);
  if (!vaccine) {
    throw new Error('Vaccine not found');
  }

  const record: VaccinationRecord = {
    id: nextRecordId++,
    vaccineId: input.vaccineId,
    vaccineName: vaccine.name,
    animalIds: input.animalIds,
    eligibleAnimalIds: input.eligibleAnimalIds,
    ineligibleAnimalIds: input.ineligibleAnimalIds,
    date: input.date,
    center: input.center,
    status: input.status,
    entries: [],
  };

  if (record.status === 'done') {
    record.entries = createEntries(record);
  }

  records.unshift(record);
  return { ...record, entries: [...record.entries] };
}

export function processPendingVaccinationRecord(recordId: number) {
  const record = records.find((item) => item.id === recordId);
  if (!record) return null;

  if (record.status !== 'done') {
    record.status = 'done';
    record.entries = createEntries(record);
    record.eligibleAnimalIds.forEach((animalId) => {
      appendAnimalVaccineHistory({
        animalId,
        vaccineName: record.vaccineName,
        date: record.date,
        centre: record.center,
      });
    });
  }

  return { ...record, entries: [...record.entries] };
}

export function getAnimalName(animalId: string) {
  return getAllAnimals().find((animal) => animal.id === animalId)?.name ?? animalId;
}
