'use client';

import React from 'react';
import { LotStatus } from '../../types/lot';
import { CheckCircle2, Circle } from 'lucide-react';

interface LotTimelineProps {
  status: LotStatus;
}

export const LotTimeline: React.FC<LotTimelineProps> = ({ status }) => {
  const steps = [
    { key: 'created', label: 'Lot Created' },
    { key: 'identified', label: 'Material Identified' },
    { key: 'recycler', label: 'Recycler Selected' },
    { key: 'pickup', label: 'Pickup Scheduled' },
    { key: 'handover', label: 'Digital Handover' },
    { key: 'payment', label: 'Payment Pending' },
    { key: 'completed', label: 'Completed' },
  ];

  const getStepIndex = (s: LotStatus): number => {
    switch (s) {
      case 'Draft': return 0;
      case 'Ready for Recycler': return 1;
      case 'Recycler Selected': return 2;
      case 'Pickup Scheduled': return 3;
      case 'Handed Over': return 4;
      case 'Payment Pending': return 5;
      case 'Completed': return 6;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
          Digital Traceability Timeline
        </h4>
        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          State Certified
        </span>
      </div>

      <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative flex items-center justify-between text-xs sm:text-sm">
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${
                  isDone
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              <span className={`font-semibold ${isDone ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                {step.label}
              </span>

              {isCurrent && (
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                  Current Status
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
