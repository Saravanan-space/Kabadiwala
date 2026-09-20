'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  Wallet,
  Leaf,
  Trees,
  CheckCircle2,
} from 'lucide-react';

interface MyEarningsScreenProps {
  onBack: () => void;
}

export function MyEarningsScreen({ onBack }: MyEarningsScreenProps) {
  const { t } = useLanguage();

  const mockPayouts = [
    { id: '1', date: 'Yesterday', lot: 'KBD-1042', amount: 1638, status: 'Completed', method: 'UPI' },
    { id: '2', date: '18 Sep 2026', lot: 'KBD-0988', amount: 2100, status: 'Completed', method: 'Cash' },
    { id: '3', date: '12 Sep 2026', lot: 'KBD-0912', amount: 1112, status: 'Completed', method: 'UPI' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('my_earnings')}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${t('my_earnings')}. ${t('total_earned')} ₹4,850. 32.5 kg e-waste recycled.`}
      />

      <div className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Main Hero Card: Total Earned */}
        <div className="bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-purple-900/20 space-y-3">
          <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>{t('total_earned')}</span>
          </div>

          <div className="text-4xl font-black tracking-tight">
            ₹4,850
          </div>

          <div className="pt-2 border-t border-purple-500/40 flex items-center justify-between text-xs text-purple-100 font-semibold">
            <span>32.5 kg {t('items_recycled')}</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-full">3 Payouts</span>
          </div>
        </div>

        {/* Environmental Impact Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-emerald-900 leading-none block">
                18
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {t('trees_saved')}
              </span>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-teal-900 leading-none block">
                42 kg
              </span>
              <span className="text-xs font-semibold text-teal-700">
                {t('co2_reduced')}
              </span>
            </div>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            {t('payout_history')}
          </h3>

          <div className="space-y-3">
            {mockPayouts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {p.lot}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.method}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {p.date}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-700 block">
                    +₹{p.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
