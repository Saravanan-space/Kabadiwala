'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  Building2,
  PlusCircle,
  UserCheck,
  Handshake,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface LotDetailsScreenProps {
  onBack: () => void;
  onVerifyHandover: () => void;
  lot?: any;
}

export function LotDetailsScreen({
  onBack,
  onVerifyHandover,
  lot = {
    id: 'KBD-1042',
    material: 'Cable',
    weight: 0.5,
    priceRange: '₹90–₹110',
    recycler: {
      name: 'GreenCycle Recycling',
      address: 'MIDC Andheri East, Mumbai',
      rate: 210,
    },
    statusStep: 4, // Handover pending
  },
}: LotDetailsScreenProps) {
  const { t, speakText } = useLanguage();

  const timelineSteps = [
    { key: 'status_created', icon: PlusCircle, done: true, time: t('just_now') },
    { key: 'status_recycler_selected', icon: UserCheck, done: true, time: t('just_now') },
    { key: 'status_offer_accepted', icon: Handshake, done: true, time: t('just_now') },
    { key: 'status_handover_pending', icon: MessageSquare, done: true, time: t('just_now') },
    { key: 'status_handover_confirmed', icon: CheckCircle2, done: false, time: t('pending') },
    { key: 'status_payment_completed', icon: DollarSign, done: false, time: t('pending') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('lot_details_title', { id: lot.id })}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${t('lot_details_title', { id: lot.id })}. Item: ${lot.material}, ${lot.weight} kg. Selected recycler: ${lot.recycler.name}. Handover pending.`}
      />

      <div className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Item Summary Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
            alt={lot.material}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">
              {lot.material}
            </h3>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              {lot.weight} kg
            </p>
            <p className="text-base font-extrabold text-emerald-700 mt-1">
              {lot.priceRange}
            </p>
          </div>
        </div>

        {/* Selected Recycler Light Green Box matching reference UI */}
        <div className="bg-emerald-100/70 border border-emerald-200/80 rounded-3xl p-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              {t('selected_recycler')}
            </span>
            <h4 className="text-lg font-bold text-slate-900 leading-snug">
              {lot.recycler.name}
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              {lot.recycler.address}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-black text-emerald-800">
              ₹{lot.recycler.rate}
            </span>
            <span className="text-xs font-semibold text-slate-500 block">
              {t('per_kg')}
            </span>
          </div>
        </div>

        {/* Status Timeline Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            {t('status_title')}
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineSteps.map((stepItem, idx) => {
              const IconComp = stepItem.icon;
              return (
                <div key={idx} className="relative flex items-center justify-between">
                  {/* Circle Marker */}
                  <div
                    className={`absolute -left-[1.65rem] w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      stepItem.done
                        ? 'bg-emerald-100 border-emerald-600 text-emerald-700'
                        : 'bg-slate-100 border-slate-300 text-slate-400'
                    }`}
                  >
                    <IconComp className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  {/* Step Text */}
                  <div>
                    <h5
                      className={`text-base font-bold leading-none ${
                        stepItem.done ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {t(stepItem.key)}
                    </h5>
                    <span className="text-xs text-slate-500 mt-1 block font-medium">
                      {stepItem.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            speakText(t('verify_handover_btn'));
            onVerifyHandover();
          }}
          className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all"
        >
          <span>{t('verify_handover_btn')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
