'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export interface StatusModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  details?: { label: string; value: string | number }[];
  buttonText?: string;
  type?: 'success' | 'info' | 'warning';
  onConfirm: () => void;
}

export function StatusConfirmationModal({
  isOpen,
  title,
  subtitle,
  details,
  buttonText = 'OK, Understood',
  type = 'success',
  onConfirm,
}: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-200 flex flex-col p-6 sm:p-7 text-center">
        {/* Big Tick / Status Icon */}
        <div className="mx-auto mb-4">
          {type === 'success' && (
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center border-4 border-emerald-50 shadow-inner">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
          )}
          {type === 'info' && (
            <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center border-4 border-blue-50 shadow-inner">
              <Info className="w-12 h-12 stroke-[2.5]" />
            </div>
          )}
          {type === 'warning' && (
            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center border-4 border-amber-50 shadow-inner">
              <AlertCircle className="w-12 h-12 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Details Box if provided */}
        {details && details.length > 0 && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
            {details.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">{item.label}</span>
                <span className="font-mono font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Action Recorded & Verified</span>
        </div>

        {/* Mandatory OK Button */}
        <button
          onClick={onConfirm}
          className="mt-6 w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-black text-base shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
