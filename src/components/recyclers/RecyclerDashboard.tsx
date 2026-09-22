'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { IncomingLotsTab, IncomingLot } from './IncomingLotsTab';
import { RateCardTab, MaterialRateItem } from './RateCardTab';
import { RecyclerProfileTab, RecyclerProfileData } from './RecyclerProfileTab';
import { HistoryTrackingTab } from './HistoryTrackingTab';
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
  const [activeTab, setActiveTab] = useState<'incoming' | 'rates' | 'history' | 'profile'>('incoming');

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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  GreenCycle Recycling
                </h1>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 • {t('recycler_mode')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Icon Button */}
            <button
              onClick={handleSpeechTab}
              className={`p-2.5 rounded-full border transition-all shadow-sm ${
                isPlayingHeader
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={t('read_aloud')}
            >
              <Volume2 className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Switch Mode Button */}
            <button
              onClick={onSwitchToSellerMode}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Seller</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Recycler KPI Stat Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-800 text-white rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-emerald-200 font-bold block">{t('active_lots')}</span>
            <span className="text-2xl font-black mt-0.5 block">{activeLotsCount}</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 font-bold block">{t('completed')}</span>
            <span className="text-2xl font-black text-emerald-800 mt-0.5 block">{completedLotsCount}</span>
          </div>
        </div>

        {/* Tab Navigation Pill Buttons */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'incoming'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Lots</span>
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'rates'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'history'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Track</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'profile'
                ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'incoming' && (
          <IncomingLotsTab lots={lots} onUpdateLotStatus={onUpdateLotStatus} />
        )}

        {activeTab === 'rates' && <RateCardTab />}

        {activeTab === 'history' && <HistoryTrackingTab />}

        {activeTab === 'profile' && <RecyclerProfileTab />}
      </main>
    </div>
  );
}
