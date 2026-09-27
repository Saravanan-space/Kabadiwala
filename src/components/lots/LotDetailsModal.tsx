'use client';

import React, { useState } from 'react';
import { WasteLot } from '../../types/lot';
import { LotTimeline } from './LotTimeline';
import {
  X,
  Building2,
  QrCode,
  ArrowRight,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';
import { EPRInvoiceModal } from '../recyclers/EPRInvoiceModal';
import { buildEPRInvoiceDataFromLot, generateEPRInvoicePDF } from '../../services/eprPdfService';

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
  const [showEPRModal, setShowEPRModal] = useState<boolean>(false);

  if (!lot) return null;

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    const invoiceData = buildEPRInvoiceDataFromLot({
      id: lot.id,
      material: lot.items.map((i) => i.material).join(', '),
      weight: lot.totalWeightKg,
      offerPrice: Math.round(lot.totalEstimatedValue / (lot.totalWeightKg || 1)),
      finalAmount: lot.totalEstimatedValue,
      itemizedBreakdown: lot.items.map((i) => ({
        name: i.material,
        weightKg: i.weightKg,
        offerPrice: i.ratePerKg,
        subtotal: i.estimatedValue,
      })),
      status: lot.status,
    });
    generateEPRInvoicePDF(invoiceData);
  };

  return (
    <>
      {showEPRModal && (
        <EPRInvoiceModal
          lot={{
            id: lot.id,
            material: lot.items.map((i) => i.material).join(', '),
            weight: lot.totalWeightKg,
            offerPrice: Math.round(lot.totalEstimatedValue / (lot.totalWeightKg || 1)),
            finalAmount: lot.totalEstimatedValue,
            itemizedBreakdown: lot.items.map((i) => ({
              name: i.material,
              weightKg: i.weightKg,
              offerPrice: i.ratePerKg,
              subtotal: i.estimatedValue,
            })),
            status: lot.status,
          }}
          onClose={() => setShowEPRModal(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
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
              <div className="absolute bottom-2 left-2 bg-white/90 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                Traceability Image Verified
              </div>
            </div>
          )}

          {/* Valuation Banner */}
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-center space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {lot.status === 'Completed' ? 'Total Payout Received' : 'Estimated Total Lot Value'}
            </span>
            <div className="text-3xl font-black text-emerald-700">
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
                <span className="font-black text-emerald-700">
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
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{lot.recyclerName}</span>
              </div>
              {lot.handoverCode && (
                <div className="text-xs text-emerald-700 font-mono pt-1">
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
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-800/20"
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
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-800/20"
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
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 px-5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Confirm Payment Received (₹{lot.totalEstimatedValue})</span>
              </button>
            )}

            {lot.status === 'Completed' && (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setShowEPRModal(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>View Official EPR Certificate</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-800/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download EPR Invoice (PDF)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
