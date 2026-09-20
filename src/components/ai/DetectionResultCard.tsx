'use client';

import React, { useState } from 'react';
import { Detection } from '../../types/ai';
import { WeightEditor } from './WeightEditor';
import { CheckCircle2, AlertTriangle, Edit3, ChevronDown, Check } from 'lucide-react';
import { MANUAL_CATEGORIES } from '../../services/aiService';

interface DetectionResultCardProps {
  detection: Detection;
  onUpdateDetection: (updated: Detection) => void;
  onConfirmItem?: () => void;
}

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  detection,
  onUpdateDetection,
  onConfirmItem,
}) => {
  const [isEditingWeight, setIsEditingWeight] = useState<boolean>(false);
  const [isSelectingCategory, setIsSelectingCategory] = useState<boolean>(false);

  const confidencePct = Math.round(detection.confidence * 100);
  const isHighConfidence = confidencePct >= 60;

  const currentWeight = detection.weight_estimate_kg || 1.0;
  const currentRate = detection.price_per_kg || 320;
  const currentValue = Math.round(currentWeight * currentRate);

  const handleWeightChange = (newWeightKg: number) => {
    onUpdateDetection({
      ...detection,
      weight_estimate_kg: newWeightKg,
      estimated_value: Math.round(newWeightKg * currentRate),
    });
  };

  const handleCategorySelect = (catName: string, defaultPrice: number) => {
    onUpdateDetection({
      ...detection,
      class_name: catName,
      price_per_kg: defaultPrice,
      estimated_value: Math.round(currentWeight * defaultPrice),
      confidence: 1.0,
    });
    setIsSelectingCategory(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header with Material & Confidence */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {detection.class_name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">YOLO Object Detection</p>
        </div>

        {/* Confidence Badge */}
        {isHighConfidence ? (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>High confidence ({confidencePct}%)</span>
          </div>
        ) : (
          <div className="bg-amber-50 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low confidence ({confidencePct}%)</span>
          </div>
        )}
      </div>

      {/* Low Confidence Warning Notice */}
      {!isHighConfidence && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Please verify this material category manually</span>
          </div>
          <p className="text-xs text-amber-800">
            Model confidence is below verification threshold. Select the correct category below.
          </p>
          <button
            onClick={() => setIsSelectingCategory(!isSelectingCategory)}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1"
          >
            <span>Select Category Manually</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Manual Category Selection List */}
      {isSelectingCategory && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {MANUAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name, cat.defaultPriceKg)}
              className="p-2.5 text-left bg-white hover:bg-blue-50 rounded-lg text-xs border border-slate-200 hover:border-blue-300 flex items-center justify-between text-slate-800 transition-colors"
            >
              <span className="font-bold truncate">{cat.name}</span>
              <span className="text-[11px] text-blue-700 font-extrabold">₹{cat.defaultPriceKg}/kg</span>
            </button>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <div>
          <span className="text-xs font-bold text-slate-500 block uppercase">Weight</span>
          <span className="font-extrabold text-slate-900">{currentWeight} kg</span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-500 block uppercase">Rate</span>
          <span className="font-extrabold text-blue-600">₹{currentRate}/kg</span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-500 block uppercase">Est. Value</span>
          <span className="font-black text-slate-900 text-base">₹{currentValue}</span>
        </div>
      </div>

      {/* Expand Weight Editor Toggle */}
      {isEditingWeight ? (
        <WeightEditor
          materialName={detection.class_name}
          aiWeightKg={detection.weight_estimate_kg || 1.0}
          ratePerKg={currentRate}
          onWeightChange={handleWeightChange}
        />
      ) : (
        <div className="flex items-center space-x-3 pt-1">
          <button
            onClick={() => setIsEditingWeight(true)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-slate-300"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span>Adjust Weight & Rate</span>
          </button>

          <button
            onClick={onConfirmItem}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Confirm Item</span>
          </button>
        </div>
      )}
    </div>
  );
};
