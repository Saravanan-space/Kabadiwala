'use client';

import React from 'react';
import { WasteLot } from '../../types/lot';
import { Recycler } from '../../types/recycler';
import { X, QrCode, CheckCircle2 } from 'lucide-react';

interface HandoverModalProps {
  lot: WasteLot | null;
  recycler: Recycler | null;
  onClose: () => void;
  onConfirmHandover: (handoverCode: string) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  lot,
  recycler,
  onClose,
  onConfirmHandover,
}) => {
  if (!lot) return null;

  const handoverCode = `HAND-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Digital Handover</h3>
              <p className="text-xs text-slate-500">Verifiable E-Waste Transfer Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Visualization Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4 shadow-inner">
          <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-md border-4 border-blue-500">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              <rect x="0" y="0" width="30" height="30" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" />

              <rect x="70" y="0" width="30" height="30" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" />

              <rect x="0" y="70" width="30" height="30" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" />

              <rect x="40" y="10" width="10" height="20" />
              <rect x="50" y="40" width="20" height="10" />
              <rect x="20" y="40" width="15" height="15" />
              <rect x="45" y="70" width="20" height="20" />
              <rect x="75" y="45" width="15" height="20" />
              <rect x="70" y="75" width="20" height="15" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-slate-500 block">Handover Code</span>
            <div className="text-2xl font-black text-blue-600 font-mono tracking-widest mt-1">
              {handoverCode}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Show QR code to recycler for transfer verification</p>
          </div>
        </div>

        {/* Handover Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Lot ID:</span>
            <span className="font-extrabold text-slate-900">{lot.id}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Matched Recycler:</span>
            <span className="font-bold text-blue-700">{recycler?.name || lot.recyclerName || 'GreenCycle Recycling'}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Total Weight:</span>
            <span className="font-bold text-slate-900">{lot.totalWeightKg} kg</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Agreed Revenue:</span>
            <span className="font-black text-blue-600 text-base">
              ₹{lot.totalEstimatedValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Primary Blue Button */}
        <button
          onClick={() => onConfirmHandover(handoverCode)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>Confirm Digital Handover Complete</span>
        </button>
      </div>
    </div>
  );
};
