'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  Building2,
  CheckCircle2,
  MapPin,
  Truck,
  Star,
  Package,
} from 'lucide-react';
import { StatusConfirmationModal } from '../common/StatusConfirmationModal';

interface FindRecyclerScreenProps {
  onBack: () => void;
  onSelectRecycler: (recycler: any) => void;
  lotId?: string;
  materialName?: string;
  weightKg?: number;
}

export const MOCK_RECYCLERS = [
  {
    id: 'rec-1',
    name: 'GreenCycle Recycling',
    rate: 210,
    authorized: true,
    distanceKm: 12.0,
    pickupAvailable: true,
    rating: 4.7,
    address: 'MIDC Andheri East, Mumbai',
    isBestMatch: true,
    reasons: ['Authorized recycler', 'Accepts Cable', 'Pickup available'],
  },
  {
    id: 'rec-2',
    name: 'EcoLoop Recycling',
    rate: 215,
    authorized: true,
    distanceKm: 20.0,
    pickupAvailable: false,
    rating: 4.5,
    address: 'Bhandup Industrial Area, Mumbai',
    isBestMatch: false,
    reasons: ['Highest price offer'],
  },
  {
    id: 'rec-3',
    name: 'Prakriti Scrap Mart',
    rate: 195,
    authorized: true,
    distanceKm: 5.5,
    pickupAvailable: true,
    rating: 4.6,
    address: 'Kurla West, Mumbai',
    isBestMatch: false,
    reasons: ['Closest location'],
  },
];

export function FindRecyclerScreen({
  onBack,
  onSelectRecycler,
  lotId = 'KBD-1042',
  materialName = 'Cable',
  weightKg = 0.5,
}: FindRecyclerScreenProps) {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'best' | 'highest' | 'closest'>('best');
  const [pendingRecycler, setPendingRecycler] = useState<any | null>(null);

  const getFilteredRecyclers = () => {
    let list = [...MOCK_RECYCLERS];
    if (activeFilter === 'highest') {
      list.sort((a, b) => b.rate - a.rate);
    } else if (activeFilter === 'closest') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  };

  const filteredRecyclers = getFilteredRecyclers();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('find_recycler_title')}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${t('find_recycler_title')}. Lot ${lotId}, ${materialName} ${weightKg} kg. Select authorized recycler.`}
      />

      <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Top Summary & Filter Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          {/* Lot summary banner */}
          <div className="bg-emerald-100/80 border border-emerald-200/80 rounded-2xl p-3 px-4 flex items-center gap-3 text-emerald-900 font-bold text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <span>
              {lotId} ({materialName} • {weightKg} kg)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveFilter('best')}
              className={`py-2 px-4 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeFilter === 'best'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t('filter_best_match')}
            </button>
            <button
              onClick={() => setActiveFilter('highest')}
              className={`py-2 px-4 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeFilter === 'highest'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t('filter_highest_price')}
            </button>
            <button
              onClick={() => setActiveFilter('closest')}
              className={`py-2 px-4 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeFilter === 'closest'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t('filter_closest')}
            </button>
          </div>
        </div>

        {/* Recyclers List Grid (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredRecyclers.map((rec) => (
            <div
              key={rec.id}
              className={`bg-white rounded-3xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                rec.isBestMatch
                  ? 'border-emerald-600 ring-2 ring-emerald-600/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Best Match Banner Header */}
                {rec.isBestMatch && (
                  <div className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-white text-emerald-800" />
                    <span>{t('best_match_badge')}</span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Main Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                        <Building2 className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          {rec.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
                          {rec.authorized && (
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t('authorized')}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{rec.distanceKm} km</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-emerald-800 leading-none block">
                        ₹{rec.rate}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {t('per_kg')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {rec.address}
                  </p>

                  {/* Pickup & Rating Pills */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${
                        rec.pickupAvailable
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>
                        {rec.pickupAvailable
                          ? t('pickup_available')
                          : t('no_pickup')}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{rec.rating}</span>
                    </span>
                  </div>

                  {/* Best Match Highlight Box */}
                  {rec.isBestMatch && (
                    <div className="bg-emerald-100/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1 text-xs text-emerald-900 font-medium">
                      <span className="font-bold text-emerald-950 block">
                        Best match because:
                      </span>
                      {rec.reasons.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Button */}
              <div className="p-5 sm:p-6 pt-0">
                <button
                  onClick={() => {
                    setPendingRecycler(rec);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
                >
                  {t('select_recycler_btn')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Force User OK Status Popup Modal */}
        {pendingRecycler && (
          <StatusConfirmationModal
            isOpen={!!pendingRecycler}
            title="Authorized Recycler Assigned"
            subtitle={`You have selected ${pendingRecycler.name} for Lot #${lotId}. Recycler will review the lot and commit rates.`}
            type="success"
            details={[
              { label: 'Lot Identifier', value: lotId },
              { label: 'Recycler Name', value: pendingRecycler.name },
              { label: 'Offered Rate', value: `₹${pendingRecycler.rate} / kg` },
              { label: 'Facility Address', value: pendingRecycler.address },
              { label: 'Est. Valuation', value: `₹${Math.round(weightKg * pendingRecycler.rate).toLocaleString('en-IN')}` },
            ]}
            buttonText="OK, View Lot Pipeline"
            onConfirm={() => {
              const chosen = pendingRecycler;
              setPendingRecycler(null);
              onSelectRecycler(chosen);
            }}
          />
        )}
      </div>
    </div>
  );
}
