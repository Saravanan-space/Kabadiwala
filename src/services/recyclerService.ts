import { Recycler } from '../types/recycler';

export const INITIAL_RECYCLERS: Recycler[] = [
  {
    id: 'rec-001',
    name: 'GreenCycle Recycling Facility',
    distanceKm: 2.8,
    isAuthorized: true,
    regNumber: 'KSPCB/EW/2024/8892',
    address: 'Plot 42, Peenya Industrial Area Phase 2, Bengaluru',
    phone: '+91 98765 43210',
    acceptedMaterials: ['PCB', 'Cable', 'Battery', 'Motor', 'Copper'],
    buyingRates: {
      PCB: 335,
      Cable: 630,
      Battery: 100,
      Motor: 250,
    },
    pickupAvailable: true,
    operatingHours: '8:00 AM - 7:00 PM',
    rating: 4.9,
    serviceArea: 'Bengaluru West & North',
  },
  {
    id: 'rec-002',
    name: 'EcoRecycle India Pvt Ltd',
    distanceKm: 4.2,
    isAuthorized: true,
    regNumber: 'CPCB/EWASTE/REG-2023/14',
    address: 'Survey 109, Electronic City Phase 1, Bengaluru',
    phone: '+91 98123 76543',
    acceptedMaterials: ['PCB', 'Mobile', 'Laptop', 'LCD', 'Battery'],
    buyingRates: {
      PCB: 330,
      Mobile: 470,
      Laptop: 540,
      Battery: 98,
    },
    pickupAvailable: true,
    operatingHours: '9:00 AM - 6:00 PM',
    rating: 4.8,
    serviceArea: 'Bengaluru South & East',
  },
  {
    id: 'rec-003',
    name: 'Urban E-Scrap Processing Yard',
    distanceKm: 6.1,
    isAuthorized: true,
    regNumber: 'KSPCB/AUTH/2025/309',
    address: 'Near Outer Ring Road, Hebbal, Bengaluru',
    phone: '+91 99001 12233',
    acceptedMaterials: ['Cable', 'Motor', 'Aluminium', 'CRT', 'Plastic'],
    buyingRates: {
      Cable: 620,
      Motor: 245,
      Aluminium: 185,
      CRT: 50,
    },
    pickupAvailable: false,
    operatingHours: '7:30 AM - 8:00 PM',
    rating: 4.6,
    serviceArea: 'Bengaluru North',
  },
  {
    id: 'rec-004',
    name: 'CleanTech E-Waste Recyclers',
    distanceKm: 8.5,
    isAuthorized: true,
    regNumber: 'CPCB/EW/BGLR/2022/90',
    address: 'Bommasandra Industrial Area, Bengaluru',
    phone: '+91 97444 55566',
    acceptedMaterials: ['PCB', 'Cable', 'Battery', 'Magnet', 'Copper'],
    buyingRates: {
      PCB: 340,
      Cable: 640,
      Battery: 105,
      Magnet: 435,
    },
    pickupAvailable: true,
    operatingHours: '8:30 AM - 6:30 PM',
    rating: 4.7,
    serviceArea: 'Greater Bengaluru',
  },
];

export async function fetchRecyclers(location: string = 'Bengaluru'): Promise<Recycler[]> {
  // GET /api/v1/recyclers
  return Promise.resolve(INITIAL_RECYCLERS);
}
