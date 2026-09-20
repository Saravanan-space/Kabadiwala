'use client';

import React from 'react';
import { Detection } from '../../types/ai';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface ValueSummaryProps {
  detections: Detection[];
  onCreateLot: () => void;
}

export const ValueSummary: React.FC<ValueSummaryProps> = ({ detections, onCreateLot }) => {
  const { t } = useTranslation();

  const totalValue = detections.reduce((sum, det) => {
    const w = det.weight_estimate_kg || 1.0;
    const r = det.price_per_kg || 320;
    return sum + Math.round(w * r);
  }, 0);

  const totalWeight = detections.reduce((sum, det) => sum + (det.weight_estimate_kg || 1.0), 0);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* High-visibility value header */}
      <div className="text-center bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
        <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider block">
          {t('totalEstimatedValue')}
        </span>
        <div className="text-4xl font-black text-slate-900 flex items-center justify-center tracking-tight">
          <span className="text-blue-600">₹</span>
          <span>{totalValue.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-xs text-slate-500 font-medium mt-1">
          Combined Weight: <span className="font-bold text-slate-900">{totalWeight.toFixed(1)} kg</span>
        </div>
      </div>

      {/* Itemized breakdown list */}
      <div className="space-y-2">
        <span className="text-xs uppercase font-extrabold text-slate-500 px-1 block">
          Valuation Breakdown
        </span>
        {detections.map((det, idx) => {
          const weight = det.weight_estimate_kg || 1.0;
          const rate = det.price_per_kg || 320;
          const val = Math.round(weight * rate);

          return (
            <div
              key={idx}
              className="bg-white px-4 py-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm shadow-xs"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">{det.class_name}</span>
                <span className="text-xs text-slate-500">
                  {weight} kg @ ₹{rate}/kg
                </span>
              </div>
              <div className="text-base font-black text-blue-600">
                ₹{val.toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Blue Button */}
      <button
        onClick={onCreateLot}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4.5 px-6 rounded-xl text-base uppercase tracking-wide flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transform active:scale-98 transition-all"
      >
        <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
        <span>Create Waste Lot</span>
        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
