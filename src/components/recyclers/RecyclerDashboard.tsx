'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { IncomingLotsTab, IncomingLot } from './IncomingLotsTab';
import { RateCardTab, MaterialRateItem } from './RateCardTab';
import { RecyclerProfileTab, RecyclerProfileData } from './RecyclerProfileTab';
import { HistoryTrackingTab } from './HistoryTrackingTab';
import { DatasetsTab } from './DatasetsTab';
import {
  Building2,
  Package,
  BarChart3,
  User,
  Volume2,
  ArrowLeft,
  ShieldCheck,
  Star,
  RefreshCw,
  Database,
} from 'lucide-react';

interface RecyclerDashboardProps {
  onSwitchToSellerMode: () => void;
  lots: IncomingLot[];
  onUpdateLotStatus: (lotId: string, status: IncomingLot['status'], extra?: any) => void;
}

export function RecyclerDashboard({
  onSwitchToSellerMode,
  lots,
  onUpdateLotStatus,
}: RecyclerDashboardProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [activeTab, setActiveTab] = useState<'incoming' | 'rates' | 'history' | 'profile' | 'datasets'>('incoming');

  const activeLotsCount = lots.filter((l) => l.status !== 'Completed').length;
  const completedLotsCount = lots.filter((l) => l.status === 'Completed').length;

  const isPlayingHeader = isSpeaking && speakingId === 'recycler-header-tts';

  const getTabTitle = () => {
    switch (activeTab) {
      case 'incoming':
        return t('tab_incoming_lots');
      case 'rates':
        return t('tab_rate_card');
      case 'history':
        return t('tab_history');
      case 'profile':
        return t('tab_profile');
      case 'datasets':
        return 'Datasets & Schemas';
      default:
        return t('recycler_dashboard_title');
    }
  };

  const handleSpeechTab = () => {
    speakText(
      `${t('recycler_dashboard_title')}. ${getTabTitle()}. Active lots ${activeLotsCount}. Completed lots ${completedLotsCount}.`,
      'recycler-header-tts'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900">
      {/* Top Recycler Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  GreenCycle Recycling
                </h1>
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 • {t('recycler_mode')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sound Icon Button */}
            <button
              onClick={handleSpeechTab}
              className={`p-2.5 sm:p-3 rounded-full border transition-all shadow-sm ${
                isPlayingHeader
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse scale-105'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={t('read_aloud')}
            >
              <Volume2 className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Switch Mode Button */}
            <button
              onClick={onSwitchToSellerMode}
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
              <span>Seller Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Recycler KPI Stat Row (Responsive 4 columns on sm+) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-sm">
            <span className="text-xs text-emerald-200 font-bold block">{t('active_lots')}</span>
            <span className="text-2xl sm:text-3xl font-black mt-1 block">{activeLotsCount}</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-bold block">{t('completed')}</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1 block">{completedLotsCount}</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-bold block">Avg Buying Rate</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">₹218/kg</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
            <span className="text-xs text-slate-500 font-bold block">Compliance Status</span>
            <span className="text-base sm:text-lg font-black text-emerald-700 mt-2 block flex items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Authorized
            </span>
          </div>
        </div>

        {/* Tab Navigation Pill Buttons (5 tabs) */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 bg-slate-200/70 p-1.5 sm:p-2 rounded-2xl text-xs sm:text-sm font-bold max-w-3xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-2.5 sm:py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'incoming'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Lots</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2.5 sm:py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'rates'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 sm:py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Track</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 sm:py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('datasets')}
            className={`py-2.5 sm:py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'datasets'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate">Datasets</span>
          </button>
        </div>

        {/* Active Tab View */}
        <div className="pt-2">
          {activeTab === 'incoming' && (
            <IncomingLotsTab lots={lots} onUpdateLotStatus={onUpdateLotStatus} />
          )}

          {activeTab === 'rates' && <RateCardTab />}

          {activeTab === 'history' && <HistoryTrackingTab />}

          {activeTab === 'profile' && <RecyclerProfileTab />}

          {activeTab === 'datasets' && <DatasetsTab />}
        </div>
      </main>
    </div>
  );
}

