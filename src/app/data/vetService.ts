export type ServiceMode = 'farm-visit' | 'video-consultation';

export const serviceModes = [
  {
    id: 'farm-visit' as ServiceMode,
    title: 'Scheduled farm visit',
    description: 'Book a veterinarian to visit the farm for checkups, treatment, and herd support.',
    eta: 'Same day or next day',
    badgeClass: 'bg-[#E6F7EF] text-[#1E9E6F]',
  },
  {
    id: 'video-consultation' as ServiceMode,
    title: 'Video consultation',
    description: 'Share live symptoms, photos, and follow-up details for remote care.',
    eta: 'Within 30 minutes',
    badgeClass: 'bg-[#EAF3FB] text-[#0F4C81]',
  },
];

export const serviceCategories = [
  'General health checkup',
  'Disease diagnosis',
  'Vaccination planning',
  'Prescription and treatment plan',
  'Surgery and wound care',
  'Pregnancy and fertility support',
  'Emergency stabilization',
];

export const vets = [
  {
    id: 1,
    name: 'Dr. Nadia Islam',
    specialty: 'Cattle and dairy specialist',
    serviceTypes: ['farm-visit', 'video-consultation'],
    location: 'Badda livestock zone',
    price: 500,
    rating: 4.8,
    availability: 'Available today',
    onlineStatus: 'online',
  },
  {
    id: 2,
    name: 'Dr. Mahmud Hasan',
    specialty: 'Livestock surgeon',
    serviceTypes: ['farm-visit'],
    location: 'Savar field unit',
    price: 650,
    rating: 4.7,
    availability: 'Available tomorrow',
    onlineStatus: 'offline',
  },
  {
    id: 3,
    name: 'Dr. Farhana Akter',
    specialty: 'Poultry and goat care',
    serviceTypes: ['video-consultation', 'farm-visit'],
    location: 'Keraniganj care point',
    price: 450,
    rating: 4.6,
    availability: 'Video slots open',
    onlineStatus: 'offline',
  },
];
