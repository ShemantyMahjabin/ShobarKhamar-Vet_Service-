export type AnimalRecord = {
  id: string;
  name: string;
  breed: string;
  age: string;
  status: string;
  note: string;
  description: string;
};

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
