export type LotStatus =
  | 'Draft'
  | 'Ready for Recycler'
  | 'Recycler Selected'
  | 'Pickup Scheduled'
  | 'Handed Over'
  | 'Payment Pending'
  | 'Completed';

export interface LotItem {
  material: string;
  weightKg: number;
  ratePerKg: number;
  estimatedValue: number;
  confidence?: number;
  aiEstimatedWeightKg?: number;
  actualWeightKg?: number;
}

export interface WasteLot {
  id: string; // e.g. LOT-EW-2026-00182
  items: LotItem[];
  totalWeightKg: number;
  totalEstimatedValue: number;
  imageUri?: string;
  location: string;
  createdAt: string;
  status: LotStatus;
  recyclerId?: string;
  recyclerName?: string;
  handoverCode?: string;
  paymentMethod?: string;
  paidAt?: string;
}
