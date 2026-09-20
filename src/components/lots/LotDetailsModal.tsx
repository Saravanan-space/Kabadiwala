'use client';

import React from 'react';
import { WasteLot } from '../../types/lot';
import { LotTimeline } from './LotTimeline';
import { X, Building2, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LotDetailsModalProps {
  lot: WasteLot | null;
  onClose: () => void;
  onFindRecycler: (lot: WasteLot) => void;
  onGenerateHandover: (lot: WasteLot) => void;
  onConfirmPayment: (lot: WasteLot) => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({
  lot,
  onClose,
  onFindRecycler,
  onGenerateHandover,
  onConfirmPayment,
}) => {
  if (!lot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
              Digital Lot Record
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{lot.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo preview */}
        {lot.imageUri && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img src={lot.imageUri} alt="Lot preview" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-white/90 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
              Traceability Image Verified
            </div>
          </div>
        )}

        {/* Valuation Banner */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Estimated Total Lot Value
          </span>
          <div className="text-3xl font-black text-blue-600">
            ₹{lot.totalEstimatedValue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Total Weight: <span className="text-slate-900 font-bold">{lot.totalWeightKg} kg</span>
          </p>
        </div>

        {/* Included items */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Materials Included
          </span>
          {lot.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm font-medium"
            >
              <div>
                <span className="font-bold text-slate-900 block">{item.material}</span>
                <span className="text-xs text-slate-500">
                  {item.weightKg} kg @ ₹{item.ratePerKg}/kg
                </span>
              </div>
              <span className="font-black text-blue-600">
                ₹{item.estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Recycler Info */}
        {lot.recyclerName && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Matched Recycler</span>
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{lot.recyclerName}</span>
            </div>
            {lot.handoverCode && (
              <div className="text-xs text-blue-700 font-mono pt-1">
                Handover Code: <span className="font-bold text-slate-900">{lot.handoverCode}</span>
              </div>
            )}
          </div>
        )}

        {/* Digital Timeline */}
        <LotTimeline status={lot.status} />

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {(lot.status === 'Draft' || lot.status === 'Ready for Recycler') && (
            <button
              onClick={() => {
                onClose();
                onFindRecycler(lot);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <Building2 className="w-5 h-5 stroke-[2.5]" />
              <span>Find Authorized Recycler</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {lot.status === 'Recycler Selected' && (
            <button
              onClick={() => {
                onClose();
                onGenerateHandover(lot);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <QrCode className="w-5 h-5 stroke-[2.5]" />
              <span>Start Digital Handover (QR)</span>
            </button>
          )}

          {lot.status === 'Payment Pending' && (
            <button
              onClick={() => {
                onClose();
                onConfirmPayment(lot);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Confirm Payment Received (₹{lot.totalEstimatedValue})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
