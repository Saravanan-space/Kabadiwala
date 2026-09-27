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

      <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Earnings summary & Environmental impact */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Hero Card: Total Earned */}
            <div className="bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-purple-900/20 space-y-4">
              <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
                <Wallet className="w-4 h-4" />
                <span>{t('total_earned')}</span>
              </div>

              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                ₹4,850
              </div>

              <div className="pt-3 border-t border-purple-500/40 flex items-center justify-between text-xs sm:text-sm text-purple-100 font-semibold">
                <span>32.5 kg {t('items_recycled')}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">3 Verified Payouts</span>
              </div>
            </div>

            {/* Environmental Impact Badges */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-center gap-3.5 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Trees className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-900 leading-none block">
                    18
                  </span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                    {t('trees_saved')}
                  </span>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 flex items-center gap-3.5 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-teal-900 leading-none block">
                    42 kg
                  </span>
                  <span className="text-xs font-bold text-teal-700 mt-0.5 block">
                    {t('co2_reduced')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payout History Section */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">
                {t('payout_history')}
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Direct Settlement
              </span>
            </div>

            <div className="space-y-3">
              {mockPayouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {p.lot}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {p.method}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">
                      {p.date} • Settled to Account
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700 block">
                      +₹{p.amount}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      Success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
