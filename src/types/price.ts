export interface MaterialPrice {
  id: string;
  material: string;
  category: string;
  price_per_kg: number;
  market_min: number;
  market_max: number;
  trend: 'up' | 'flat' | 'down';
  unit: string;
  updated_at: string;
  description: string;
  safetyNote?: string;
  icon: string;
}
