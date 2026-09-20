import { Transaction } from '../types/transaction';
import { getStoredLots } from './lotService';

const STORAGE_KEY = 'kabadiwala_transactions';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-2026-0091',
    lotId: 'LOT-EW-2026-00182',
    material: 'PCB (Printed Circuit Board)',
    weightKg: 2.5,
    recyclerName: 'GreenCycle Recycling Facility',
    amount: 800,
    paymentMethod: 'UPI',
    status: 'Completed',
    date: '14 Sep 2026',
    time: '11:15 AM',
  },
  {
    id: 'TXN-2026-0090',
    lotId: 'LOT-EW-2026-00181',
    material: 'Copper Cable & Wires',
    weightKg: 4.2,
    recyclerName: 'GreenCycle Recycling Facility',
    amount: 2562,
    paymentMethod: 'UPI',
    status: 'Pending',
    date: '14 Sep 2026',
    time: '09:40 AM',
  },
  {
    id: 'TXN-2026-0089',
    lotId: 'LOT-EW-2026-00179',
    material: 'Electric Motor Scrap',
    weightKg: 8.0,
    recyclerName: 'EcoRecycle India Pvt Ltd',
    amount: 1920,
    paymentMethod: 'Cash',
    status: 'Completed',
    date: '13 Sep 2026',
    time: '05:20 PM',
  },
  {
    id: 'TXN-2026-0088',
    lotId: 'LOT-EW-2026-00178',
    material: 'Lithium Battery Pack',
    weightKg: 4.0,
    recyclerName: 'CleanTech E-Waste Recyclers',
    amount: 420,
    paymentMethod: 'UPI',
    status: 'Completed',
    date: '12 Sep 2026',
    time: '02:10 PM',
  },
];

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(txns: Transaction[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
  }
}

export function recordTransaction(
  lotId: string,
  material: string,
  weightKg: number,
  recyclerName: string,
  amount: number,
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' = 'UPI'
): Transaction {
  const txns = getStoredTransactions();
  const id = `TXN-2026-${String(92 + txns.length).padStart(4, '0')}`;
  const now = new Date();
  
  const newTxn: Transaction = {
    id,
    lotId,
    material,
    weightKg,
    recyclerName,
    amount,
    paymentMethod,
    status: 'Completed',
    date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };

  const updated = [newTxn, ...txns];
  saveTransactions(updated);
  return newTxn;
}

export function calculateEarnings() {
  const txns = getStoredTransactions();
  const lots = getStoredLots();

  let todayEarned = 0;
  let thisMonthEarned = 18620;
  let pendingAmount = 0;

  txns.forEach((t) => {
    if (t.status === 'Completed') {
      todayEarned += t.amount;
    }
  });

  lots.forEach((l) => {
    if (l.status === 'Payment Pending') {
      pendingAmount += l.totalEstimatedValue;
    }
  });

  return {
    today: todayEarned > 0 ? todayEarned : 2450,
    thisWeek: 8920 + todayEarned,
    thisMonth: thisMonthEarned + todayEarned,
    pending: pendingAmount > 0 ? pendingAmount : 1250,
    totalLots: lots.length,
    completedCount: txns.filter((t) => t.status === 'Completed').length,
  };
}
