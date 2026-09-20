'use client';

import React, { useState } from 'react';
import { Scale, RefreshCw } from 'lucide-react';

interface WeightEditorProps {
  materialName: string;
  aiWeightKg: number;
  ratePerKg: number;
  onWeightChange: (newWeight: number) => void;
}

export const WeightEditor: React.FC<WeightEditorProps> = ({
  materialName,
  aiWeightKg,
  ratePerKg,
  onWeightChange,
}) => {
  const [actualWeight, setActualWeight] = useState<number>(aiWeightKg);

  const handleAdjust = (delta: number) => {
    const next = Math.max(0.1, Number((actualWeight + delta).toFixed(1)));
    setActualWeight(next);
    onWeightChange(next);
  };

  const calculatedValue = Math.round(actualWeight * ratePerKg);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Physical Weight Input</h4>
            <p className="text-xs text-slate-500">Adjust real scale weighing value</p>
          </div>
        </div>
        <span className="bg-white text-blue-700 font-extrabold text-xs px-3 py-1 rounded-full border border-blue-200 shadow-xs">
          ₹{ratePerKg}/kg
        </span>
      </div>

      {/* AI Estimated vs Actual Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
            AI Estimated Weight
          </span>
          <div className="text-base font-extrabold text-slate-800 mt-0.5">
            {aiWeightKg} kg
          </div>
        </div>

        <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 relative">
          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 block">
            Actual Weight
          </span>
          <div className="text-lg font-black text-blue-900 mt-0.5 flex items-center justify-between">
            <span>{actualWeight} kg</span>
            <button
              onClick={() => {
                setActualWeight(aiWeightKg);
                onWeightChange(aiWeightKg);
              }}
              title="Reset to AI estimate"
              className="text-slate-400 hover:text-blue-600 p-1"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Large Touch Adjustment Stepper Buttons */}
      <div className="flex items-center justify-between space-x-2 pt-1">
        <button
          onClick={() => handleAdjust(-1.0)}
          className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-black py-3.5 rounded-xl border border-slate-300 active:scale-95 transition-all text-sm shadow-xs"
        >
          -1.0 kg
        </button>

        <button
          onClick={() => handleAdjust(-0.1)}
          className="w-12 bg-white hover:bg-slate-100 text-slate-900 font-black py-3.5 rounded-xl border border-slate-300 active:scale-95 transition-all text-sm shadow-xs"
        >
          -0.1
        </button>

        <div className="bg-white px-4 py-2 rounded-xl border-2 border-blue-500 text-center min-w-[90px] shadow-xs">
          <span className="text-2xl font-black text-blue-600 block">{actualWeight}</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase">KG</span>
        </div>

        <button
          onClick={() => handleAdjust(0.1)}
          className="w-12 bg-white hover:bg-slate-100 text-slate-900 font-black py-3.5 rounded-xl border border-slate-300 active:scale-95 transition-all text-sm shadow-xs"
        >
          +0.1
        </button>

        <button
          onClick={() => handleAdjust(1.0)}
          className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-black py-3.5 rounded-xl border border-slate-300 active:scale-95 transition-all text-sm shadow-xs"
        >
          +1.0 kg
        </button>
      </div>

      {/* Real-time Calculation Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-blue-100 block">
            {actualWeight} kg × ₹{ratePerKg}/kg
          </span>
          <span className="text-[11px] text-blue-200">Live Estimated Lot Value</span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          ₹{calculatedValue.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};
