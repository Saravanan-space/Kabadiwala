export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number; // e.g. 0.94 for 94%
  bbox: BoundingBox;
  weight_estimate_kg?: number;
  price_per_kg?: number;
  estimated_value?: number;
}

export interface WasteDetectionResponse {
  success: boolean;
  image_id: string;
  detections: Detection[];
  total_estimated_value?: number;
  currency?: string;
  message?: string;
  raw_response?: unknown;
}

export type AIState =
  | 'IDLE'
  | 'UPLOADING'
  | 'ANALYZING'
  | 'RESULT'
  | 'NO_DETECTION'
  | 'LOW_CONFIDENCE'
  | 'ERROR'
  | 'OFFLINE';

export interface ManualCategory {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  kannadaName: string;
  defaultPriceKg: number;
  iconName: string;
}
