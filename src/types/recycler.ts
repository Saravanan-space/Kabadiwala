export interface Recycler {
  id: string;
  name: string;
  distanceKm: number;
  isAuthorized: boolean;
  regNumber: string;
  address: string;
  phone: string;
  acceptedMaterials: string[];
  buyingRates: Record<string, number>;
  pickupAvailable: boolean;
  operatingHours: string;
  rating: number;
  serviceArea: string;
}
