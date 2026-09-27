export type LotStatus =
  | 'Draft'
  | 'Ready for Recycler'
  | 'Recycler Selected'
  | 'Pickup Scheduled'
  | 'Pickup Person On The Way'
  | 'Handed Over'
  | 'Handover Pending'
  | 'Payment Pending'
  | 'Completed'
  | 'Quote Locked'
  | 'Quote Declined'
  | 'Finding Recycler';

export interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  accuracyMeters?: number;
}

export interface PickupDispatchInfo {
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  driverRating?: number;
  etaMinutes: number;
  distanceKm: number;
  dispatchedAt: string;
  status: 'En Route' | 'Near Location' | 'Arrived' | 'Completed';
  pickupCode?: string;
}

export interface LotItem {
  material: string;
  weightKg: number;
  ratePerKg: number;
  estimatedValue: number;
  confidence?: number;
  aiEstimatedWeightKg?: number;
  actualWeightKg?: number;
}

export interface MaterialQuote {
  material_category: string;
  weight_kg: number;
  rate_per_kg: number;
  subtotal_inr: number;
  recycler_id?: string;
  timestamp?: string;
}

export interface MaterialTransaction {
  lot_id: string;
  material_category: string;
  weight_kg: number;
  rate_per_kg: number;
  subtotal_inr: number;
  recycler_id: string;
  timestamp: string;
}

export interface WasteLot {
  id: string; // e.g. LOT-EW-2026-00182
  items: LotItem[];
  totalWeightKg: number;
  totalEstimatedValue: number;
  imageUri?: string;
  location: string;
  gpsLocation?: GPSLocation;
  dispatchInfo?: PickupDispatchInfo;
  createdAt: string;
  status: LotStatus;
  recyclerId?: string;
  recyclerName?: string;
  handoverCode?: string;
  paymentMethod?: string;
  paidAt?: string;
  quotedRates?: MaterialQuote[];
  quoteStatus?: 'pending' | 'locked' | 'accepted' | 'declined';
  quotedTotal?: number;
}

export interface Lot {
  id: string;
  material?: string;
  weight?: number;
  priceRange?: string;
  offerPrice?: number;
  pickupType?: 'home' | 'self' | 'both';
  recycler?: any;
  status: LotStatus;
  timestamp?: string;
  items?: LotItem[];
  itemizedBreakdown?: Array<{
    name: string;
    weightKg: number;
    offerPrice: number;
    subtotal: number;
  }>;
  quotedRates?: MaterialQuote[];
  quoteStatus?: 'pending' | 'locked' | 'accepted' | 'declined';
  quotedTotal?: number;
  verifiedWeight?: number;
  finalAmount?: number;
  customerName?: string;
  customerAddress?: string;
  gpsLocation?: any;
  dispatchInfo?: any;
}

