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
  const { t, openLanguageSelector, speakText } = useLanguage();

  const mainSpeechText = `${t('app_title')}. ${t('greeting')}. ${t('sell_material_title')}: ${t('sell_material_desc')}. ${t('todays_rates')}, ${t('my_lots')}, ${t('my_earnings')}.`;

  return (
    <div className="flex flex-col gap-5 px-4 py-4 sm:px-6 max-w-md mx-auto w-full pb-24 font-sans">
      {/* 1. Large Main Hero Banner: Sell Material */}
      <button
        onClick={() => {
          speakText(`${t('sell_material_title')}. ${t('sell_material_desc')}`);
          onNavigate('sell');
        }}
        className="w-full text-left bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] transition-all rounded-3xl p-6 text-white shadow-xl shadow-emerald-800/25 flex items-center justify-between group relative overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-600/50 flex items-center justify-center shrink-0 shadow-inner">
            <Camera className="w-9 h-9 text-white stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              {t('sell_material_title')}
            </h2>
            <p className="text-emerald-100 text-sm font-medium mt-1">
              {t('sell_material_desc')}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-emerald-700/60 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0">
          <ArrowRight className="w-6 h-6 text-white stroke-[2.5]" />
        </div>
      </button>

      {/* 2. 2-Column Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Rates */}
        <button
          onClick={() => {
            speakText(t('todays_rates'));
            onNavigate('todays_rates');
          }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">
                {t('todays_rates')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* My Lots */}
        <button
          onClick={() => {
            speakText(t('my_lots'));
            onNavigate('my_lots');
          }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500/50 active:scale-[0.98] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">
                {t('my_lots')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3. Full Width Card: My Earnings */}
      <button
        onClick={() => {
          speakText(t('my_earnings'));
          onNavigate('my_earnings');
        }}
        className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-purple-500/50 active:scale-[0.99] transition-all flex items-center justify-between group text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block leading-tight">
              {t('my_earnings')}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* 4. Summary Counters (Active & Completed Lots) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Lots Counter */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <div>
            <span className="text-xl font-black text-amber-900 block leading-none">
              {activeLotsCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 mt-1 block">
              {t('active_lots')}
            </span>
          </div>
        </div>

        {/* Completed Counter */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <span className="text-xl font-black text-emerald-900 block leading-none">
              {completedLotsCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 mt-1 block">
              {t('completed')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation Circular Buttons */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* Find Recycler */}
        <button
          onClick={() => {
            speakText(t('find_recycler'));
            onNavigate('find_recycler');
          }}
          className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-800 group-hover:bg-emerald-200 transition-colors shadow-xs">
            <Search className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 text-center">
            {t('find_recycler')}
          </span>
        </button>

        {/* Help */}
        <button
          onClick={() => {
            speakText(t('help'));
            onNavigate('help');
          }}
          className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100/80 border border-amber-200/70 flex items-center justify-center text-amber-800 group-hover:bg-amber-200 transition-colors shadow-xs">
            <HelpCircle className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-amber-800 text-center">
            {t('help')}
          </span>
        </button>

        {/* Language */}
        <button
          onClick={() => {
            speakText(t('language'));
            openLanguageSelector();
          }}
          className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors shadow-xs">
            <Globe className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 text-center">
            {t('language')}
          </span>
        </button>
      </div>
    </div>
  );
}
