'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Building2,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface IncomingLot {
  id: string;
  material: string;
  weight: number;
  verifiedWeight?: number;
  priceRange: string;
  offerPrice: number;
  customerName?: string;
  customerAddress?: string;
  pickupType: 'home' | 'self';
  status: 'Draft' | 'Ready for Recycler' | 'Recycler Selected' | 'Handover Pending' | 'Completed';
  timestamp: string;
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

  const filteredLots = lots.filter((lot) => {
    if (filter === 'pending') return lot.status !== 'Completed';
    if (filter === 'completed') return lot.status === 'Completed';
    return true;
  });

  const handleStartHandover = (lot: IncomingLot) => {
    setVerifyingLotId(lot.id);
    setInputWeight(String(lot.weight || 1));
  };

  const handleConfirmHandover = (lot: IncomingLot) => {
    const finalWeight = parseFloat(inputWeight) || lot.weight || 1;
    const finalAmount = Math.round(finalWeight * lot.offerPrice);

    onUpdateLotStatus(lot.id, 'Completed', {
      verifiedWeight: finalWeight,
      finalAmount,
    });

    setVerifyingLotId(null);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
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
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Active / Pending ({lots.filter((l) => l.status !== 'Completed').length})
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Completed ({lots.filter((l) => l.status === 'Completed').length})
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
        <div className="space-y-3">
          {filteredLots.map((lot) => {
            const isCompleted = lot.status === 'Completed';
            const isVerifying = verifyingLotId === lot.id;
            const isPlayingThis = isSpeaking && speakingId === `lot-${lot.id}`;

            return (
              <div
                key={lot.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-lg">{lot.id}</span>
                        <span
                          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {lot.status}
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
                    <span className="text-slate-900 font-bold">{lot.material}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Weight</span>
                    <span className="text-slate-900 font-bold">{lot.verifiedWeight || lot.weight} kg</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Buying Rate</span>
                    <span className="text-emerald-700 font-bold">₹{lot.offerPrice} /kg</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Type</span>
                    <span className="text-slate-900 font-bold flex items-center gap-1">
                      {lot.pickupType === 'home' ? (
                        <>
                          <Truck className="w-3.5 h-3.5 text-emerald-600" /> Home Pickup
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-blue-600" /> Self Drop
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Customer Address if available */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{lot.customerAddress || 'MIDC Industrial Area, Andheri East, Mumbai'}</span>
                </div>

                {/* Handover Verification Form / Action */}
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
                        Confirm Payout & Complete
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
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Handover & Payment Completed
                    </span>
                    <span className="text-emerald-950 font-black">
                      ₹{Math.round((lot.verifiedWeight || lot.weight) * lot.offerPrice)} Paid
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartHandover(lot)}
                    className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Handover & Issue Payout</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
