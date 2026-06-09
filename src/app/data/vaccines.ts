export type VaccineCatalogItem = {
  id: number;
  name: string;
  centerName?: string;
  supports: string[];
  disease: string;
  ageRangeMonths: [number, number];
  weightRangeKg: [number, number];
  teethCounts: number[];
  dose: string;
  schedule: string;
  stock: string;
  note: string;
  recommendedDays: number;
};

const userVaccinesStorageKey = 'shobar-khamar-user-vaccines';

export const vaccineCatalog: VaccineCatalogItem[] = [
  {
    id: 1,
    name: 'FMD vaccine',
    centerName: 'Badda Livestock Vaccine Point',
    supports: ['cow', 'cattle'],
    disease: 'Foot and mouth disease',
    ageRangeMonths: [22, 46],
    weightRangeKg: [170, 330],
    teethCounts: [4, 5, 6, 7, 8],
    dose: '2 ml',
    schedule: 'Every 6 months',
    stock: '124 doses available',
    note: 'Used for foot and mouth disease prevention in herd animals.',
    recommendedDays: 180,
  },
  {
    id: 2,
    name: 'Black Quarter',
    centerName: 'Savar Field Vaccination Camp',
    supports: ['cattle', 'calf'],
    disease: 'Black quarter',
    ageRangeMonths: [22, 40],
    weightRangeKg: [130, 250],
    teethCounts: [2, 3, 4, 5],
    dose: '3 ml',
    schedule: 'Once yearly',
    stock: '72 doses available',
    note: 'Protects growing cattle from sudden bacterial muscle infection.',
    recommendedDays: 365,
  },
  {
    id: 3,
    name: 'Hemorrhagic Septicemia',
    centerName: 'Badda Livestock Vaccine Point',
    supports: ['cow', 'cattle'],
    disease: 'Hemorrhagic septicemia',
    ageRangeMonths: [28, 46],
    weightRangeKg: [170, 330],
    teethCounts: [4, 5, 6, 7, 8, 9],
    dose: '2 ml',
    schedule: 'Before monsoon each year',
    stock: '96 doses available',
    note: 'Important seasonal protection before high-risk weather periods.',
    recommendedDays: 365,
  },
  {
    id: 4,
    name: 'Anthrax booster',
    centerName: 'Savar Field Vaccination Camp',
    supports: ['cattle', 'goat'],
    disease: 'Anthrax',
    ageRangeMonths: [22, 40],
    weightRangeKg: [130, 250],
    teethCounts: [3, 4, 5, 6],
    dose: '1 ml',
    schedule: 'Once yearly',
    stock: '58 doses available',
    note: 'Used for annual anthrax booster coverage in mixed farms.',
    recommendedDays: 365,
  },
  {
    id: 5,
    name: 'PPR vaccine',
    centerName: 'Keraniganj Goat Care Center',
    supports: ['goat'],
    disease: 'PPR',
    ageRangeMonths: [10, 34],
    weightRangeKg: [30, 70],
    teethCounts: [1, 2, 3, 4],
    dose: '1 ml',
    schedule: 'Once yearly',
    stock: '88 doses available',
    note: 'Prevents peste des petits ruminants in goats.',
    recommendedDays: 365,
  },
  {
    id: 6,
    name: 'Goat pox vaccine',
    centerName: 'Keraniganj Goat Care Center',
    supports: ['goat'],
    disease: 'Goat pox',
    ageRangeMonths: [10, 28],
    weightRangeKg: [30, 60],
    teethCounts: [1, 2, 3],
    dose: '0.5 ml',
    schedule: 'Every 6 months',
    stock: '41 doses available',
    note: 'Helps reduce pox spread and production loss in goats.',
    recommendedDays: 180,
  },
];

export function getSavedVaccines() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedVaccines = window.localStorage.getItem(userVaccinesStorageKey);
    return savedVaccines ? (JSON.parse(savedVaccines) as VaccineCatalogItem[]) : [];
  } catch {
    return [];
  }
}

export function getAllVaccines() {
  return [...getSavedVaccines(), ...vaccineCatalog];
}

export function saveVaccineRecord(vaccine: VaccineCatalogItem) {
  const savedVaccines = getSavedVaccines();
  const nextVaccines = [vaccine, ...savedVaccines.filter((savedVaccine) => savedVaccine.id !== vaccine.id)];
  window.localStorage.setItem(userVaccinesStorageKey, JSON.stringify(nextVaccines));
}
