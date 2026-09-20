export interface Transaction {
  id: string; // e.g. TXN-2026-0091
  lotId: string;
  material: string;
  weightKg: number;
  recyclerName: string;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer';
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  time: string;
}
