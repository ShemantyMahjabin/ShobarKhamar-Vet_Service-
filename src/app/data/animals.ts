export type AnimalMediaFile = {
  name: string;
  url: string;
  type: string;
};

export type AnimalRecord = {
  id: string;
  name: string;
  breed: string;
  age: string;
  ageMin?: string;
  ageMax?: string;
  weight?: string;
  weightMin?: string;
  weightMax?: string;
  animalType?: string;
  subtype?: string;
  color?: string;
  teethCount?: string;
  height?: string;
  width?: string;
  length?: string;
  hasCalved?: string;
  mediaFiles?: Array<string | AnimalMediaFile>;
  diseaseHistory?: Array<{
    diseaseName: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
  }>;
  vaccineHistory?: Array<{
    vaccineName: string;
    date: string;
    centre: string;
    sideEffect: string;
    sideEffectImageName: string;
    sideEffectImageUrl?: string;
  }>;
  status: string;
  note: string;
  description: string;
};

const userAnimalsStorageKey = 'shobar-khamar-user-animals';

export const animals: AnimalRecord[] = [
  {
    id: 'Cow A12',
    name: 'Daisy',
    breed: 'Holstein',
    age: '3 years 2 months',
    status: 'Healthy',
    note: 'Pregnant',
    description: 'Adult dairy cow with strong milk yield, currently under pregnancy monitoring.',
  },
  {
    id: 'Goat G08',
    name: 'Misti',
    breed: 'Black Bengal',
    age: '1 year',
    status: 'Needs check',
    note: 'Reduced appetite',
    description: 'Young breeding goat showing reduced feed intake and mild weakness since morning.',
  },
  {
    id: 'Calf C03',
    name: 'Shona',
    breed: 'Local',
    age: '6 months',
    status: 'Recovered',
    note: 'Past fever case',
    description: 'Growing calf recovered from recent fever, now under routine follow-up observation.',
  },
  {
    id: 'Poultry P04',
    name: 'Layer Batch 4',
    breed: 'Layer',
    age: '8 months',
    status: 'Under review',
    note: 'Respiratory concern',
    description: 'Layer group with early respiratory symptoms requiring quick flock-level assessment.',
  },
];

export function getSavedAnimals() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedAnimals = window.localStorage.getItem(userAnimalsStorageKey);
    return savedAnimals ? (JSON.parse(savedAnimals) as AnimalRecord[]) : [];
  } catch {
    return [];
  }
}

export function getAllAnimals() {
  return [...getSavedAnimals(), ...animals];
}

export function saveAnimalRecord(animal: AnimalRecord) {
  const savedAnimals = getSavedAnimals();
  const nextAnimals = [animal, ...savedAnimals.filter((savedAnimal) => savedAnimal.id !== animal.id)];
  window.localStorage.setItem(userAnimalsStorageKey, JSON.stringify(nextAnimals));
}
