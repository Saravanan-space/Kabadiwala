'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Camera,
  ArrowRight,
  BarChart3,
  Package,
  Wallet,
  Search,
  HelpCircle,
  Globe,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface UserMainInterfaceProps {
  onNavigate: (screen: string) => void;
  activeLotsCount?: number;
  completedLotsCount?: number;
}

export function UserMainInterface({
  onNavigate,
  activeLotsCount = 0,
  completedLotsCount = 0,
}: UserMainInterfaceProps) {
  const { t, openLanguageSelector } = useLanguage();

  return (
    <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 font-sans space-y-6">
      {/* Dynamic Grid for Tablet / Desktop (12 columns on lg+, clean stack on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Primary Column (col-span-12 lg:col-span-8 space-y-6) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* 1. Large Main Hero Banner: Sell Material */}
          <button
            onClick={() => {
              onNavigate('sell');
            }}
            className="w-full text-left bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] transition-all rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-800/25 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-700/80 border border-emerald-600/50 flex items-center justify-center shrink-0 shadow-inner">
                <Camera className="w-9 h-9 sm:w-11 sm:h-11 text-white stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-200 block mb-1">
                  AI Instant Valuation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {t('sell_material_title')}
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base font-medium mt-1">
                  {t('sell_material_desc')}
                </p>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-emerald-700/60 flex items-center justify-center group-hover:translate-x-1.5 transition-transform shrink-0 ml-2">
              <ArrowRight className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </button>

          {/* 2. Responsive 2-Column Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Today's Rates */}
            <button
              onClick={() => {
                onNavigate('todays_rates');
              }}
              className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-slate-900 block leading-tight">
                    {t('todays_rates')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Live market pricing</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* My Lots */}
            <button
              onClick={() => {
                onNavigate('my_lots');
              }}
              className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-slate-900 block leading-tight">
                    {t('my_lots')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">View active handovers</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* 3. Full Width Card: My Earnings */}
          <button
            onClick={() => {
              onNavigate('my_earnings');
            }}
            className="w-full bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-purple-500/50 active:scale-[0.99] transition-all flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base sm:text-xl font-bold text-slate-900 block leading-tight">
                  {t('my_earnings')}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Instant UPI & Cash Payout History
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-sm font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                ₹4,850 Total
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </button>
        </div>

        {/* Right / Secondary Column (col-span-12 lg:col-span-5 space-y-5) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Summary Counters (Active & Completed Lots) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Active Lots Counter */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl sm:rounded-3xl p-5 flex items-center gap-3.5 shadow-xs">
              <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-black text-amber-900 block leading-none">
                  {activeLotsCount}
                </span>
                <span className="text-xs font-bold text-amber-700 mt-1 block">
                  {t('active_lots')}
                </span>
              </div>
            </div>

            {/* Completed Counter */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl sm:rounded-3xl p-5 flex items-center gap-3.5 shadow-xs">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-900 block leading-none">
                  {completedLotsCount}
                </span>
                <span className="text-xs font-bold text-emerald-700 mt-1 block">
                  {t('completed')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Bottom Navigation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-3 gap-3">
              {/* Find Recycler */}
              <button
                onClick={() => {
                  onNavigate('find_recycler');
                }}
                className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-200 transition-colors shadow-xs">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 text-center">
                  {t('find_recycler')}
                </span>
              </button>

              {/* Help */}
              <button
                onClick={() => {
                  onNavigate('help');
                }}
                className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100/80 border border-amber-200/70 flex items-center justify-center text-amber-800 group-hover:bg-amber-200 transition-colors shadow-xs">
                  <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-amber-800 text-center">
                  {t('help')}
                </span>
              </button>

              {/* Language */}
              <button
                onClick={() => {
                  openLanguageSelector();
                }}
                className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors shadow-xs">
                  <Globe className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 text-center">
                  {t('language')}
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
