import { WasteLot, LotStatus } from '../types/lot';

const STORAGE_KEY = 'kabadiwala_waste_lots';

export const INITIAL_LOTS: WasteLot[] = [
  {
    id: 'LOT-EW-2026-00182',
    items: [
      {
        material: 'PCB',
        weightKg: 2.5,
        ratePerKg: 320,
        estimatedValue: 800,
        confidence: 0.94,
      },
    ],
    totalWeightKg: 2.5,
    totalEstimatedValue: 800,
    location: 'Bengaluru',
    createdAt: '14 Sep 2026, 10:30 AM',
    status: 'Completed',
    recyclerId: 'rec-001',
    recyclerName: 'GreenCycle Recycling Facility',
    handoverCode: 'HAND-2026-009182',
    paymentMethod: 'UPI',
    paidAt: '14 Sep 2026, 11:15 AM',
  },
  {
    id: 'LOT-EW-2026-00181',
    items: [
      {
        material: 'Copper Cable',
        weightKg: 4.2,
        ratePerKg: 610,
        estimatedValue: 2562,
        confidence: 0.91,
      },
    ],
    totalWeightKg: 4.2,
    totalEstimatedValue: 2562,
    location: 'Bengaluru',
    createdAt: '14 Sep 2026, 09:15 AM',
    status: 'Payment Pending',
    recyclerId: 'rec-001',
    recyclerName: 'GreenCycle Recycling Facility',
    handoverCode: 'HAND-2026-009181',
  },
  {
    id: 'LOT-EW-2026-00180',
    items: [
      {
        material: 'Lithium Battery Pack',
        weightKg: 5.0,
        ratePerKg: 95,
        estimatedValue: 475,
        confidence: 0.88,
      },
    ],
    totalWeightKg: 5.0,
    totalEstimatedValue: 475,
    location: 'Bengaluru',
    createdAt: '13 Sep 2026, 04:45 PM',
    status: 'Ready for Recycler',
  },
];

export function getStoredLots(): WasteLot[] {
  if (typeof window === 'undefined') return INITIAL_LOTS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOTS));
    return INITIAL_LOTS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_LOTS;
  }
}

export function saveLots(lots: WasteLot[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
  }
}

export function createLot(newLotData: Partial<WasteLot>): WasteLot {
  const lots = getStoredLots();
  const nextNum = 183 + lots.length;
  const id = `LOT-EW-2026-${String(nextNum).padStart(5, '0')}`;
  
  const created: WasteLot = {
    id,
    items: newLotData.items || [],
    totalWeightKg: newLotData.totalWeightKg || 0,
    totalEstimatedValue: newLotData.totalEstimatedValue || 0,
    imageUri: newLotData.imageUri,
    location: newLotData.location || 'Bengaluru',
    createdAt: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: newLotData.status || 'Ready for Recycler',
  };

  const updated = [created, ...lots];
  saveLots(updated);
  return created;
}

export function updateLotStatus(
  lotId: string,
  status: LotStatus,
  extra?: Partial<WasteLot>
): WasteLot | null {
  const lots = getStoredLots();
  const index = lots.findIndex((l) => l.id === lotId);
  if (index === -1) return null;

  lots[index] = {
    ...lots[index],
    status,
    ...extra,
  };

  saveLots(lots);
  return lots[index];
}
