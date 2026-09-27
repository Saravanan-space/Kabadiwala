'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MaterialQuote } from '../../types/lot';
import {
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Building2,
  Volume2,
  ArrowLeftRight,
  FileText,
  Download,
  Phone,
  Navigation,
  Send,
  Sparkles,
  Lock,
  Calculator,
  AlertCircle,
} from 'lucide-react';
import { EPRInvoiceModal } from './EPRInvoiceModal';
import { NotifyPickupModal } from './NotifyPickupModal';
import { QuoteRatesModal } from './QuoteRatesModal';
import { buildEPRInvoiceDataFromLot, generateEPRInvoicePDF } from '../../services/eprPdfService';
import { StatusConfirmationModal } from '../common/StatusConfirmationModal';

export interface IncomingLot {
  id: string;
  material: string;
  weight: number;
  verifiedWeight?: number;
  finalAmount?: number;
  itemizedBreakdown?: Array<{
    name: string;
    weightKg: number;
    offerPrice: number;
    subtotal: number;
  }>;
  priceRange: string;
  offerPrice: number;
  customerName?: string;
  customerAddress?: string;
  gpsLocation?: any;
  dispatchInfo?: any;
  pickupType: 'home' | 'self' | 'both';
  status:
    | 'Draft'
    | 'Ready for Recycler'
    | 'Recycler Selected'
    | 'Pickup Scheduled'
    | 'Pickup Person On The Way'
    | 'Handover Pending'
    | 'Completed'
    | 'Quote Locked'
    | 'Quote Declined'
    | 'Finding Recycler';
  timestamp: string;
  quotedRates?: MaterialQuote[];
  quoteStatus?: 'pending' | 'locked' | 'accepted' | 'declined';
  quotedTotal?: number;
}

interface IncomingLotsTabProps {
  lots: IncomingLot[];
  onUpdateLotStatus: (lotId: string, status: IncomingLot['status'], extra?: any) => void;
}

export function IncomingLotsTab({ lots, onUpdateLotStatus }: IncomingLotsTabProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [verifyingLotId, setVerifyingLotId] = useState<string | null>(null);
  const [inputWeight, setInputWeight] = useState<string>('');
  const [selectedInvoiceLot, setSelectedInvoiceLot] = useState<IncomingLot | null>(null);
  const [selectedDispatchLot, setSelectedDispatchLot] = useState<IncomingLot | null>(null);
  const [selectedQuoteLot, setSelectedQuoteLot] = useState<IncomingLot | null>(null);

  const [statusModalData, setStatusModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    details?: { label: string; value: string | number }[];
    buttonText?: string;
  } | null>(null);

  const filteredLots = lots.filter((lot) => {
    if (filter === 'pending') return lot.status !== 'Completed';
    if (filter === 'completed') return lot.status === 'Completed';
    return true;
  });

  const handleStartHandover = (lot: IncomingLot) => {
    setVerifyingLotId(lot.id);
    setInputWeight(String(lot.verifiedWeight || lot.weight || 1));
  };

  const handleConfirmHandover = (lot: IncomingLot) => {
    const finalWeight = parseFloat(inputWeight) || lot.weight || 1;
    // Calculate finalAmount using locked rate if available
    const effectiveRate = lot.offerPrice || 210;
    const finalAmount = Math.round(finalWeight * effectiveRate);

    onUpdateLotStatus(lot.id, 'Completed', {
      verifiedWeight: finalWeight,
      finalAmount,
    });

    setVerifyingLotId(null);
    setStatusModalData({
      isOpen: true,
      title: 'Handover Verified & Completed',
      subtitle: 'The incoming lot physical weight has been settled and final payment recorded.',
      details: [
        { label: 'Lot Identifier', value: lot.id },
        { label: 'Material Type', value: lot.material },
        { label: 'Settled Actual Weight', value: `${finalWeight} kg` },
        { label: 'Offer Rate Applied', value: `₹${effectiveRate}/kg` },
        { label: 'Final Amount Settled', value: `₹${finalAmount.toLocaleString('en-IN')}` },
      ],
      buttonText: 'OK, Continue',
    });
  };

  const handleQuickDownloadPDF = (lot: IncomingLot, e: React.MouseEvent) => {
    e.stopPropagation();
    const invoiceData = buildEPRInvoiceDataFromLot(lot);
    generateEPRInvoicePDF(invoiceData);
  };

  return (
    <div className="space-y-6">
      {/* EPR Invoice Modal */}
      {selectedInvoiceLot && (
        <EPRInvoiceModal
          lot={selectedInvoiceLot}
          onClose={() => setSelectedInvoiceLot(null)}
        />
      )}

      {/* Notify Pickup Person On The Way Modal */}
      {selectedDispatchLot && (
        <NotifyPickupModal
          lot={selectedDispatchLot}
          onClose={() => setSelectedDispatchLot(null)}
          onConfirmDispatch={(lotId, dispatchInfo) => {
            onUpdateLotStatus(lotId, 'Pickup Person On The Way', {
              dispatchInfo,
            });
            setStatusModalData({
              isOpen: true,
              title: 'Pickup Person Dispatched',
              subtitle: 'Driver notification sent successfully. Live tracking enabled for seller.',
              details: [
                { label: 'Lot Identifier', value: lotId },
                { label: 'Driver Assigned', value: dispatchInfo.driverName },
                { label: 'Vehicle Number', value: dispatchInfo.vehicleNumber },
                { label: 'Estimated ETA', value: `${dispatchInfo.etaMinutes} Minutes` },
                { label: 'Security Pickup PIN', value: dispatchInfo.pickupCode || '4921' },
              ],
              buttonText: 'OK, Got It',
            });
          }}
        />
      )}

      {/* Per-Material Quote Entry Modal */}
      {selectedQuoteLot && (
        <QuoteRatesModal
          lot={selectedQuoteLot}
          onClose={() => setSelectedQuoteLot(null)}
          onConfirmQuote={(lotId, quotedRates, quotedTotal) => {
            const lotObj = lots.find((l) => l.id === lotId);
            const totalKg = lotObj?.weight || 1;
            const avgRate = Math.round(quotedTotal / totalKg);

            onUpdateLotStatus(lotId, 'Quote Locked', {
              quotedRates,
              quoteStatus: 'locked',
              quotedTotal,
              offerPrice: avgRate > 0 ? avgRate : (lotObj?.offerPrice || 210),
            });

            setStatusModalData({
              isOpen: true,
              title: 'Quote Rates Committed & Locked',
              subtitle: 'Binding per-material rates saved. The seller has been alerted to review and accept.',
              details: [
                { label: 'Lot Identifier', value: lotId },
                { label: 'Itemized Breakdown', value: `${quotedRates.length} Materials` },
                { label: 'Total Valuation', value: `₹${quotedTotal.toLocaleString('en-IN')}` },
                { label: 'Lock Status', value: 'Committed & Guaranteed' },
              ],
              buttonText: 'OK, Done',
            });
          }}
        />
      )}

      {/* Force User OK Status Popup Modal */}
      {statusModalData && (
        <StatusConfirmationModal
          isOpen={statusModalData.isOpen}
          title={statusModalData.title}
          subtitle={statusModalData.subtitle}
          details={statusModalData.details}
          buttonText={statusModalData.buttonText || 'OK, Understood'}
          type="success"
          onConfirm={() => setStatusModalData(null)}
        />
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          All Lots ({lots.length})
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filter === 'pending'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Active / Pending ({lots.filter((l) => l.status !== 'Completed').length})
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filter === 'completed'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Completed & Invoiced ({lots.filter((l) => l.status === 'Completed').length})
        </button>
      </div>

      {/* Lots List */}
      {filteredLots.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No incoming lots found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
            New customer lots will appear here automatically as soon as users request pickup.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filteredLots.map((lot) => {
            const isCompleted = lot.status === 'Completed';
            const isQuoteLocked = lot.status === 'Quote Locked' || lot.quoteStatus === 'locked';
            const isVerifying = verifyingLotId === lot.id;
            const isPlayingThis = isSpeaking && speakingId === `lot-${lot.id}`;
            const totalQuoteVal = lot.quotedTotal || Math.round((lot.weight || 1) * lot.offerPrice);

            return (
              <div
                key={lot.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-lg">{lot.id}</span>
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isQuoteLocked
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : lot.status === 'Quote Declined'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {isQuoteLocked && <Lock className="w-3 h-3 text-emerald-600" />}
                          {isCompleted
                            ? 'Completed (EPR Invoiced)'
                            : isQuoteLocked
                            ? `Quote Locked · ₹${totalQuoteVal.toLocaleString('en-IN')}`
                            : lot.status === 'Quote Declined'
                            ? 'Quote Declined — Finding New Recycler'
                            : lot.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(lot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>

                  {/* Sound icon button */}
                  <button
                    onClick={() =>
                      speakText(
                        `Lot ID ${lot.id}. Material ${lot.material}. Weight ${lot.weight} kg. Status ${lot.status}.`,
                        `lot-${lot.id}`
                      )
                    }
                    className={`p-2.5 rounded-full border transition-all ${
                      isPlayingThis
                        ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={t('read_aloud')}
                  >
                    <Volume2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Material</span>
                    <span className="text-slate-900 font-bold truncate block">{lot.material}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Verified Weight</span>
                    <span className="text-slate-900 font-bold">{lot.verifiedWeight || lot.weight} kg</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {isQuoteLocked ? 'Locked Rate' : 'Buying Rate'}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      {isQuoteLocked && <Lock className="w-3 h-3 text-emerald-700" />}
                      ₹{lot.offerPrice} /kg
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Type</span>
                    <span className="text-slate-900 font-bold flex items-center gap-1">
                      {lot.pickupType === 'home' ? (
                        <>
                          <Truck className="w-3.5 h-3.5 text-emerald-600" /> Home Pickup
                        </>
                      ) : lot.pickupType === 'self' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-blue-600" /> Self Drop
                        </>
                      ) : (
                        <>
                          <ArrowLeftRight className="w-3.5 h-3.5 text-purple-600" /> Both (Flexible)
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Per-Material Quote Breakdown if quote exists */}
                {lot.quotedRates && lot.quotedRates.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5 text-emerald-600" /> Per-Material Quote
                      </span>
                      <span className="font-black text-emerald-900">
                        Total: ₹{totalQuoteVal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="divide-y divide-emerald-100 text-[11px] text-emerald-900/90 font-medium">
                      {lot.quotedRates.map((q, idx) => (
                        <div key={idx} className="py-1 flex items-center justify-between">
                          <span className="truncate max-w-[150px]">{q.material_category} ({q.weight_kg}kg)</span>
                          <span className="font-mono font-bold text-emerald-900">
                            ₹{q.rate_per_kg}/kg = ₹{q.subtotal_inr}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Address if available */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{lot.customerAddress || 'MIDC Industrial Area, Andheri East, Mumbai'}</span>
                </div>

                {/* Handover Verification Form / Action / EPR Invoice Buttons */}
                {isVerifying ? (
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                    <h4 className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Confirm Actual Weight & Payout
                    </h4>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                          Actual Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={inputWeight}
                          onChange={(e) => setInputWeight(e.target.value)}
                          className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="e.g. 8.5"
                        />
                      </div>

                      <div className="flex-1 text-right">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Payout</span>
                        <span className="text-xl font-black text-emerald-900">
                          ₹{Math.round((parseFloat(inputWeight) || 0) * lot.offerPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleConfirmHandover(lot)}
                        className="flex-1 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                      >
                        Confirm Payout & Issue EPR Invoice
                      </button>
                      <button
                        onClick={() => setVerifyingLotId(null)}
                        className="px-4 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isCompleted ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Handover Settled
                      </span>
                      <span className="text-emerald-950 font-black">
                        ₹{lot.finalAmount || Math.round((lot.verifiedWeight || lot.weight) * lot.offerPrice)} Paid
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedInvoiceLot(lot)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View EPR Invoice</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickDownloadPDF(lot, e)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {/* Per-Material Quote Entry Button */}
                    <button
                      onClick={() => setSelectedQuoteLot(lot)}
                      className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 active:scale-[0.99] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <Calculator className="w-4 h-4 text-indigo-600" />
                      <span>{isQuoteLocked ? 'Edit Quoted Rates' : 'Quote Per-Material Rates & Lock'}</span>
                    </button>

                    {/* If already En Route */}
                    {lot.status === 'Pickup Person On The Way' ? (
                      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-amber-700 animate-bounce" />
                            Pickup Person En Route ({lot.dispatchInfo?.driverName || 'Suresh Kumar'})
                          </span>
                          <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                            ETA: {lot.dispatchInfo?.etaMinutes || 15}m
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold border-t border-amber-200/60 pt-1.5">
                          <span>Vehicle: {lot.dispatchInfo?.vehicleNumber || 'MH-02-AB-4581'}</span>
                          <a
                            href={`tel:${lot.dispatchInfo?.driverPhone || '+919820144556'}`}
                            className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call Driver
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Fix 2: Dispatch Button Gated Behind quoteStatus === 'accepted' */
                      lot.quoteStatus === 'accepted' ? (
                        <button
                          onClick={() => setSelectedDispatchLot(lot)}
                          className="w-full py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Notify Pickup Person On The Way</span>
                        </button>
                      ) : (
                        <div className="space-y-1">
                          <button
                            disabled
                            className="w-full py-3 rounded-2xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-300/60 transition-all"
                            title="Complete rate entry and await collector acceptance before dispatching."
                          >
                            <Truck className="w-4 h-4 text-slate-400" />
                            <span>Notify Pickup Person On The Way</span>
                          </button>
                          <p className="text-[10px] text-slate-500 font-semibold text-center px-1">
                            Complete rate entry and await collector acceptance before dispatching.
                          </p>
                        </div>
                      )
                    )}

                    {/* Handover verification button */}
                    <button
                      onClick={() => handleStartHandover(lot)}
                      className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Handover & Issue Payout</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

