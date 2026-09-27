'use client';

import React, { useState } from 'react';
import { MaterialQuote, MaterialTransaction } from '../../types/lot';
import { IncomingLot } from './IncomingLotsTab';
import {
  X,
  Lock,
  Calculator,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface QuoteRatesModalProps {
  lot: IncomingLot;
  onClose: () => void;
  onConfirmQuote: (
    lotId: string,
    quotedRates: MaterialQuote[],
    quotedTotal: number
  ) => void;
}

// Reference district median rates for real-time anomaly detection (INR/kg)
const REFERENCE_DISTRICT_MEDIANS: Record<string, number> = {
  laptop: 520,
  smartphone: 450,
  phone: 450,
  mobile: 450,
  pcb: 355,
  circuit: 355,
  camera: 350,
  cable: 210,
  wire: 210,
  copper: 210,
  motor: 140,
  compressor: 140,
  keyboard: 115,
  mouse: 105,
  mice: 105,
  battery: 75,
  lithium: 75,
  display: 85,
  screen: 85,
  monitor: 85,
  panel: 85,
};

function getDistrictMedianRate(materialName: string): number {
  const lower = (materialName || '').toLowerCase();
  if (lower.includes('laptop')) return 520;
  if (lower.includes('smart') || lower.includes('phone') || lower.includes('mobile')) return 450;
  if (lower.includes('pcb') || lower.includes('circuit')) return 355;
  if (lower.includes('camera')) return 350;
  if (lower.includes('cable') || lower.includes('wire') || lower.includes('copper')) return 210;
  if (lower.includes('motor') || lower.includes('compressor')) return 140;
  if (lower.includes('keyboard')) return 115;
  if (lower.includes('mouse') || lower.includes('mice')) return 105;
  if (lower.includes('battery') || lower.includes('lithium')) return 75;
  if (lower.includes('display') || lower.includes('screen') || lower.includes('monitor') || lower.includes('panel')) return 85;
  return 180; // Default mixed e-waste median
}

export function QuoteRatesModal({
  lot,
  onClose,
  onConfirmQuote,
}: QuoteRatesModalProps) {
  // Initialize line items
  const getInitialQuotes = (): MaterialQuote[] => {
    if (lot.quotedRates && lot.quotedRates.length > 0) {
      return lot.quotedRates.map((q) => ({ ...q }));
    }

    if (lot.itemizedBreakdown && lot.itemizedBreakdown.length > 0) {
      return lot.itemizedBreakdown.map((item) => {
        const rate = item.offerPrice || lot.offerPrice || 200;
        const weight = item.weightKg || 1;
        return {
          material_category: item.name,
          weight_kg: weight,
          rate_per_kg: rate,
          subtotal_inr: Math.round(weight * rate),
        };
      });
    }

    // Default or single material
    const defaultWeight = lot.weight || 1;
    const defaultRate = lot.offerPrice || 210;
    return [
      {
        material_category: lot.material || 'E-Waste Scrap Component',
        weight_kg: defaultWeight,
        rate_per_kg: defaultRate,
        subtotal_inr: Math.round(defaultWeight * defaultRate),
      },
    ];
  };

  const [quotes, setQuotes] = useState<MaterialQuote[]>(getInitialQuotes);

  const handleRateChange = (index: number, newRateStr: string) => {
    const rate = Math.max(0, parseFloat(newRateStr) || 0);
    setQuotes((prev) =>
      prev.map((q, idx) => {
        if (idx === index) {
          return {
            ...q,
            rate_per_kg: rate,
            subtotal_inr: Math.round(rate * q.weight_kg),
          };
        }
        return q;
      })
    );
  };

  const grandTotal = quotes.reduce((sum, q) => sum + (q.subtotal_inr || 0), 0);
  const totalWeight = quotes.reduce((sum, q) => sum + (q.weight_kg || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Create and store material_transactions
    const timestamp = new Date().toISOString();
    const transactions: MaterialTransaction[] = quotes.map((q) => ({
      lot_id: lot.id,
      material_category: q.material_category,
      weight_kg: q.weight_kg,
      rate_per_kg: q.rate_per_kg,
      subtotal_inr: q.subtotal_inr,
      recycler_id: 'REC-01',
      timestamp,
    }));

    try {
      if (typeof window !== 'undefined') {
        const existingTx = JSON.parse(
          localStorage.getItem('material_transactions') || '[]'
        );
        localStorage.setItem(
          'material_transactions',
          JSON.stringify([...existingTx, ...transactions])
        );
      }
    } catch (err) {
      console.error('Failed to store material_transactions:', err);
    }

    // 2. Trigger quote confirmation
    onConfirmQuote(lot.id, quotes, grandTotal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl text-slate-900 flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Per-Material Rate Entry & Quote Lock
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Lot ID: {lot.id} • {lot.pickupType === 'home' ? 'Doorstep Pickup' : 'Self Drop'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 font-medium">
              <span className="font-bold block">Quote-Lock Policy:</span>
              Enter your buying rate (₹/kg) for each detected material item. Once submitted, this quote is locked and sent to the collector for approval. The locked rate forms the binding payment basis.
            </div>
          </div>

          {/* Line items table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>Detected Materials ({quotes.length})</span>
              <span>Total Weight: {totalWeight.toFixed(1)} kg</span>
            </div>

            <div className="space-y-3 max-h-[42vh] overflow-y-auto pr-1">
              {quotes.map((item, idx) => {
                const median = getDistrictMedianRate(item.material_category);
                const diffBelow = median - item.rate_per_kg;
                const isBelow15Percent = item.rate_per_kg < median * 0.85;
                const isAboveMedian = item.rate_per_kg > median;

                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {item.material_category}
                          </h4>
                          <span className="text-xs text-slate-500 font-semibold">
                            Declared Weight: {item.weight_kg} kg • District Avg: ₹{median}/kg
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Subtotal
                        </span>
                        <span className="font-black text-base text-emerald-800">
                          ₹{item.subtotal_inr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Rate input field */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 items-center">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Buying Rate (₹/kg)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={item.rate_per_kg}
                            onChange={(e) => handleRateChange(idx, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            placeholder="e.g. 210"
                          />
                        </div>
                      </div>

                      <div className="text-right bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 block">Calculation</span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {item.weight_kg} kg × ₹{item.rate_per_kg}
                        </span>
                      </div>
                    </div>

                    {/* Real-time Anomaly Detection Feedback */}
                    {isBelow15Percent && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          ⚠ This rate is ₹{Math.round(diffBelow)} below the district average of ₹{median}/kg. Collector will be notified of the below-market offer.
                        </span>
                      </div>
                    )}

                    {isAboveMedian && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Above market rate — competitive offer.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* Grand Total Bar */}
          <div className="bg-emerald-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider block">
                Committed Quote Grand Total
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                {quotes.length} material items • {totalWeight.toFixed(1)} kg combined
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-white">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-extrabold text-sm shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Lock Quote & Submit (₹{grandTotal})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
